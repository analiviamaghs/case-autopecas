import supabase from '../config/supabase.js';

export const getMetricas = async () => {
    // 1. Faturamento Líquido Total (RPC)
    const { data: faturamentoData, error: errFaturamento } = await supabase
        .rpc('calcular_faturamento_liquido');

    // 2. Categorias que mais faturaram (RPC)
    const { data: categoriasData, error: errCategorias } = await supabase
        .rpc('top_categorias_faturamento');

    // 3. Peças em estoque que nunca foram vendidas (RPC com o seu SQL)
    const { data: estoqueParadoData, error: errEstoque } = await supabase
        .rpc('pecas_sem_venda');

    if (errFaturamento || errCategorias || errEstoque) {
        console.error('Erros no Supabase:', { errFaturamento, errCategorias, errEstoque });
        throw new Error('Erro ao carregar dados do dashboard.');
    }

    const itensParados = estoqueParadoData || [];

    return {
        faturamento_total: faturamentoData || 0,
        top_categorias: categoriasData || [],
        estoque_parado: {
            total_pecas_sem_venda: itensParados.length, // Total de peças distintas sem venda
            itens: itensParados
        }
    };
};