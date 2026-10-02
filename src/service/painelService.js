import { supabase } from '../config/supabase.js';

/*
    Para as questões 1 e 2 foram utilizadas funções rpc no Supabase.
    Essas funções usam as queries presentes em queries.sql.
*/
export const getMetricas = async () => {
    // 1. Faturamento Líquido Total
    // (preço unitário * quantidade * (1 - desconto/100)) para status concluída
    const { data: faturamentoData, error: errFaturamento } = await supabase
        .rpc('calcular_faturamento_liquido');

    // 2. Categorias que mais faturaram
    const { data: categoriasData, error: errCategorias } = await supabase
        .rpc('top_categorias_faturamento');

    // 3. Peças em estoque que nunca foram vendidas
    const { data: estoqueParadoData, count: totalParado, error: errEstoque } = await supabase
        .from('pecas')
        .select('sku, nome_peca, estoque_atual, custo_unitario', { count: 'exact' })
        .gt('estoque_atual', 0)
        .not('sku', 'in', (
            supabase.from('itens_venda').select('sku')
        ));

    if (errFaturamento || errCategorias || errEstoque) {
        throw new Error('Erro ao carregar dados do dashboard.');
    }
    return {
        faturamento_total: faturamentoData || 0,
        top_categorias: categoriasData || [],
        estoque_parado: {
            quantidade_total: totalParado || 0,
            itens: estoqueParadoData || []
        }
    };
};