# Decisões do Projeto

## 1. Modelagem do banco de dados

Para o armazenamento dos dados, optei por dividir as informações em três tabelas: `pecas`, `vendas` e `itens_venda`.

A tabela `pecas` armazena as informações referentes às características de cada peça. Em vez de criar um identificador adicional, optei por utilizar o `sku`, pois ele é um código exclusivo para cada peça.

A tabela `vendas` identifica cada venda por um ID único e armazena a data e a loja em que a venda foi realizada, além dos nomes do cliente e do vendedor e do status da venda. Para evitar registros incoerentes, principalmente considerando a necessidade de contabilizar apenas as vendas concluídas, o campo de status foi restringido aos valores `concluída`, `devolvida` e `cancelada`.

A tabela `itens_venda` estabelece a relação entre as peças e as vendas. Cada registro possui um ID próprio, o identificador da venda, o SKU da peça, a quantidade, o preço unitário e o desconto aplicado.

## 2. Tratamento e padronização dos dados

Antes da importação, analisei os arquivos fornecidos e identifiquei diferentes inconsistências nos dados:

- descontos armazenados tanto como valores numéricos quanto acompanhados do caractere `%`;
- valores monetários utilizando vírgula ou ponto como separador decimal, pontos separando o número em partes não decimais e alguns com '$  ';
- datas armazenadas em formatos diferentes, como `DD-MM-AAAA` e `AAAA-MM-DD`, além do uso de `-` ou `/` como separador;
- categorias apresentando variações de escrita, incluindo diferenças de acentuação e utilização de singular ou plural;
- campos textuais, como status e SKU, apresentando diferentes combinações de letras maiúsculas e minúsculas.

Para evitar que essas diferenças gerassem registros inconsistentes e prejudicassem as consultas, foram elaboradas funções responsáveis pela limpeza e padronização dos dados durante a importação.

Para valores monetários, as vírgulas são substituídas por pontos ou por espaço em branco, a depender do lugar, e os valores textuais são convertidos para `float`. O '$' é removido.

Para os descontos, além da conversão do separador decimal, o caractere `%` é removido. Quando o campo não está preenchido, o desconto é considerado como zero.

As datas armazenadas nos formatos `DD/MM/YYYY` ou `DD-MM-YYYY` são convertidas para `YYYY-MM-DD`, formato utilizado pelo banco.

As categorias são convertidas para um padrão único a partir do mapeamento das diferentes variações encontradas nos arquivos.

Para o status, valores não preenchidos são considerados como `concluida`, e os valores são convertidos para letras minúsculas para manter a consistência dos registros.

No caso do SKU, as letras são convertidas para maiúsculas, mantendo um padrão único para o identificador das peças.

## 3. Importação dos dados

A importação foi implementada em código para que o tratamento dos dados seja reproduzível e versionado.

O processo lê os arquivos CSV, separa suas colunas e aplica as funções de sanitização antes de armazenar os dados no banco. Primeiro são carregadas as peças e, posteriormente, as vendas e seus respectivos itens.

Na inserção dos itens de venda, o ID da venda e a existência de um SKU válido são utilizados para estabelecer a relação entre a venda e a peça correspondente.

Na inserção dos itens de venda, o ID da venda e a existência de um SKU válido são utilizados para estabelecer a relação entre a venda e a peça correspondente. Itens cujo SKU não foi encontrado no cadastro de peças são ignorados e registrados no console para facilitar a identificação de inconsistências na origem.

Para evitar duplicidades, cada combinação de `id_venda` e `sku` é utilizada como chave única para os itens de uma venda. Durante a leitura do CSV, um `Map` impede que a mesma combinação seja adicionada mais de uma vez. Na inserção no banco, é utilizado `upsert` com conflito em `id_venda, sku`, permitindo que o processo de carga seja executado novamente sem gerar registros duplicados.

Para as vendas, o `id_venda` é utilizado como identificador único e também como critério de conflito no `upsert`.

## 4. Consultas analíticas

Para responder às três perguntas principais do case, inicialmente elaborei as consultas SQL no arquivo `queries.sql`.

Posteriormente, optei por transformá-las em funções RPC no Supabase. Dessa forma, a lógica dos cálculos analíticos permanece próxima aos dados e o backend recebe apenas os resultados necessários para a aplicação evitando transferir todos os registros para o frontend para realizar cálculos.

Essa decisão também evita realizar o processamento de todos os registros no frontend, mantendo a responsabilidade pelos cálculos no banco de dados e deixando o código da interface mais simples.

## 5. Organização e arquitetura

Optei pela separação das funcionalidades em duas pastas principais: `backend` e `frontend`.

Essa divisão estabelece uma separação clara entre a interface da aplicação e a camada responsável pelas regras de acesso aos dados, além de facilitar a implantação dos dois componentes.

No backend, o código foi organizado em `Controller` e `Service`. Os controllers são responsáveis pelo recebimento das requisições e pelo retorno das respostas da API, enquanto os services concentram as operações relacionadas ao acesso e manipulação dos dados.

No frontend, a comunicação com o backend é realizada por meio de requisições HTTP, evitando o acesso direto ao banco de dados pela interface.

## 6. Interface e funcionalidades

A aplicação foi organizada em duas áreas principais: o painel e o gerenciamento de peças.

O painel apresenta as três respostas solicitadas no case e recursos visuais para facilitar a interpretação das informações.

Na área de peças, foi implementada uma tabela com as operações de criação, consulta, edição e exclusão. A categoria é selecionada a partir das categorias existentes, reduzindo a possibilidade de variações de escrita no cadastro. Também foi implementada a busca de peças por SKU e um filtro por categoria, permitindo uma visualização mais específica dos registros.

## 7. Decisões de escopo

Durante o desenvolvimento, priorizei as funcionalidades obrigatórias do case: carga dos dados, respostas analíticas, dashboard e CRUD de peças.

Os diferenciais foram considerados após a implementação do escopo principal, priorizando as funcionalidades que contribuíssem diretamente para responder às necessidades apresentadas no contexto do problema e manter uma aplicação funcional dentro do prazo.
Como diferenciais, foram adicionados um filtro por categoria na listagem de peças e um gráfico com a evolução do faturamento líquido mensal. Essas funcionalidades foram priorizadas por terem baixo impacto na complexidade da aplicação e contribuírem diretamente para a interpretação dos dados e a usabilidade do sistema.

