import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- FUNÇÕES DE SANITIZAÇÃO/TRATAMENTO ---

// 1. Tratamento de Números/Preços (Converte "532,46" ou "804.65" para Float)
function sanitizarNumero(valor) {
    if (!valor) return 0;
    const limpo = String(valor).replace(',', '.').trim();
    const num = parseFloat(limpo);
    return isNaN(num) ? 0 : num;
}

// 2. Tratamento de Desconto (Trata "10%", "10", null, "")
function sanitizarDesconto(valor) {
    if (!valor) return 0;
    const limpo = String(valor).replace('%', '').replace(',', '.').trim();
    const num = parseFloat(limpo);
    return isNaN(num) ? 0 : num;
}

// 3. Tratamento de Datas (Converte "02/06/2025" ou "2025-01-01" para "YYYY-MM-DD", o padrão do Supabase)
function sanitizarData(dataStr) {
    if (!dataStr) return null;
    const texto = String(dataStr).trim();

    // Caso 1: Formato DD/MM/YYYY ou DD-MM-YYYY
    if (texto.includes('/') || (texto.includes('-') && texto.split('-')[0].length === 2)) {
        const separador = texto.includes('/') ? '/' : '-';
        const partes = texto.split(separador);
        if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
    }

    // Caso 2: Já está em YYYY-MM-DD
    return texto;
}

// 4. Padronização de Categorias (Acentos, Plural e Caixas)
function sanitizarCategoria(cat) {
    if (!cat) return 'Outros';
    let texto = String(cat).trim();

    // Remove acentos
    texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    texto = texto.toUpperCase();

    // Mapeamento de-para simples para unificar variação de nomes
    const dePara = {
        'SUSPENSAO': 'SUSPENSÃO',
        'SUSPENSOES': 'SUSPENSÃO',
        'FILTRO': 'FILTROS',
        'FILTROS': 'FILTROS',
        'FREIO': 'FREIOS',
        'FREIOS': 'FREIOS',
        'MOTOR': 'MOTOR',
        'MOTORES': 'MOTOR',
        'ELETRICA': 'ELÉTRICA'
    };

    return dePara[texto] || texto;
}

// 5. Normalização do Status da Venda
function normalizarStatus(statusStr) {
    if (!statusStr) return 'concluida'; // Proteção contra valores nulos/vazios
    return String(statusStr).toLowerCase().trim();
}

//6. Normalização do Sku
//Garante que as letras serão maiúsculas em todas as linhas
function normalizarSku(sku) {
    return String(sku).toUpperCase().trim();
}

// --- FUNÇÃO PRINCIPAL DE IMPORTAÇÃO ---

async function importar() {
    console.log('Iniciando importação...');

    // --- A. IMPORTANDO PEÇAS ---
    const pecas = [];
    await new Promise((resolve) => {
        fs.createReadStream('dados/pecas.csv')
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                pecas.push({
                    sku: normalizarSku(row.sku),
                    nome_peca: row.nome_peca?.trim(),
                    categoria: sanitizarCategoria(row.categoria),
                    custo_unitario: sanitizarNumero(row.custo_unitario),
                    fornecedor: row.fornecedor?.trim(),
                    estoque_atual: parseInt(row.estoque_atual || 0, 10)
                });
            })
            .on('end', resolve);
    });

    console.log(`Processando ${pecas.length} peças...`);
    const { error: errPecas } = await supabase
        .from('pecas')
        .upsert(pecas, { onConflict: 'sku' });

    if (errPecas) console.error('Erro ao salvar peças:', errPecas);
    else console.log(' Peças importadas/atualizadas com sucesso!');

    // --- B. IMPORTANDO VENDAS E ITENS ---
    const vendasMap = new Map();
    const itensVendaUnicosMap = new Map();

    await new Promise((resolve) => {
        fs.createReadStream('dados/vendas.csv')
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                const idVenda = row.id_venda?.trim();
                const sku = normalizarSku(row.sku);

                if (idVenda && !vendasMap.has(idVenda)) {
                    vendasMap.set(idVenda, {
                        id_venda: idVenda,
                        data_venda: sanitizarData(row.data_venda),
                        loja: row.loja?.trim(),
                        cliente: row.cliente?.trim(),
                        vendedor: row.vendedor?.trim(),
                        status: normalizarStatus(row.status)
                    });
                }

                if (idVenda && sku) {
                    const chaveUnica = `${idVenda}_${sku}`;

                    const skusValidos = new Set(pecas.map(p => p.sku));

                    if (!skusValidos.has(sku)) {
                        console.warn(`SKU ${sku} ignorado na venda ${idVenda}: peça não encontrada.`);
                        return;
                    }

                    if (!itensVendaUnicosMap.has(chaveUnica)) {
                        itensVendaUnicosMap.set(chaveUnica, {
                            id_venda: idVenda,
                            sku: sku,
                            quantidade: Math.abs(parseInt(row.quantidade || 0, 10)),
                            preco_unitario: sanitizarNumero(row.preco_unitario),
                            desconto: sanitizarDesconto(row.desconto)
                        });
                    }
                }
            })
            .on('end', resolve);
    });

    // Converte os Maps para Arrays DEPOIS que o arquivo CSV foi totalmente lido
    const vendas = Array.from(vendasMap.values());
    const itensVenda = Array.from(itensVendaUnicosMap.values());

    console.log(`Processando ${vendas.length} vendas...`);

    const { error: errVendas } = await supabase
        .from('vendas')
        .upsert(vendas, { onConflict: 'id_venda' });

    if (errVendas) console.error('Erro ao salvar vendas:', errVendas);
    else console.log('Vendas importadas com sucesso!');

    console.log(`🧾 Processando ${itensVenda.length} itens de venda...`);
    const { error: errItens } = await supabase
        .from('itens_venda')
        .upsert(itensVenda, { onConflict: 'id_venda,sku' });

    if (errItens) console.error('Erro ao salvar itens de venda:', errItens);
    else console.log('Itens de venda importados com sucesso!');

    console.log('Importação concluída!');
}

importar();