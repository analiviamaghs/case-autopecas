CREATE TABLE public.pecas (
  sku text NOT NULL,
  nome_peca text NOT NULL,
  categoria text NOT NULL,
  custo_unitario numeric NOT NULL,
  fornecedor text,
  estoque_atual integer NOT NULL DEFAULT 0,
  CONSTRAINT pecas_pkey PRIMARY KEY (sku)
);
CREATE TABLE public.vendas (
  id_venda text NOT NULL,
  data_venda date NOT NULL,
  loja text,
  cliente text,
  vendedor text,
  status text NOT NULL CHECK (status = ANY (ARRAY['concluida'::text, 'devolvida'::text, 'cancelada'::text])),
  CONSTRAINT vendas_pkey PRIMARY KEY (id_venda)
);
CREATE TABLE public.itens_venda (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_venda text NOT NULL,
  sku text NOT NULL,
  quantidade integer NOT NULL,
  preco_unitario numeric NOT NULL,
  desconto numeric NOT NULL DEFAULT 0.00,
  CONSTRAINT itens_venda_pkey PRIMARY KEY (id),
  CONSTRAINT itens_venda_id_venda_fkey FOREIGN KEY (id_venda) REFERENCES public.vendas(id_venda),
  CONSTRAINT itens_venda_sku_fkey FOREIGN KEY (sku) REFERENCES public.pecas(sku)
);