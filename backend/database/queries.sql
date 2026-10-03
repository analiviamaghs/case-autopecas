/*
  Queries utilizadas para obter as respostas sobre os dados
  apresentadas na documentação do README.md
*/

-- 1. Qual o faturamento líquido total?
SELECT 
  ROUND(SUM(iv.quantidade * iv.preco_unitario * (1 - iv.desconto / 100.0)), 2) AS faturamento_liquido_total
FROM itens_venda iv
JOIN vendas v ON iv.id_venda = v.id_venda
WHERE v.status = 'concluida';

-- 2. Quais as categorias de peça que mais faturaram? (nome e valor de cada)
SELECT 
  p.categoria,
  ROUND(SUM(iv.quantidade * iv.preco_unitario * (1 - iv.desconto / 100.0)), 2) AS faturamento_total
FROM itens_venda iv
JOIN vendas v ON iv.id_venda = v.id_venda
JOIN pecas p ON iv.sku = p.sku
WHERE v.status = 'concluida'
GROUP BY p.categoria
ORDER BY faturamento_total DESC;

-- 3. Quantas peças têm estoque na prateleira e nunca foram vendidas? (quantidade e quais são)
SELECT 
  COUNT(*) AS total_pecas_sem_venda,
  STRING_AGG(p.nome_peca, ', ') AS pecas_estocadas_sem_venda
FROM pecas p
WHERE p.estoque_atual > 0
  AND p.sku NOT IN (SELECT DISTINCT sku FROM itens_venda);

-- 3.1 Detalhamento complementar: Peças não vendidas com estoque individual
SELECT 
  p.sku,
  p.nome_peca,
  p.categoria,
  p.estoque_atual
FROM pecas p
WHERE p.estoque_atual > 0
  AND p.sku NOT IN (
    SELECT DISTINCT sku 
    FROM itens_venda
  )
ORDER BY p.estoque_atual DESC;