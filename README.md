# AutoPeças Andrade

Sistema desenvolvido como solução para o case técnico da Meerkat Coding.

A aplicação permite visualizar indicadores de vendas e estoque da AutoPeças
Andrade e realizar o gerenciamento do cadastro de peças.

## Respostas do case
### 1. Faturamento Líquido Total
**R$ 886.092,01**

---

### 2. Categorias de Peça que Mais Faturaram
A categoria que mais faturou foi **ELÉTRICA**.

1. **ELÉTRICA:** R$ 225.367,56
2. **SUSPENSÃO:** R$ 197.304,0
3. **MOTOR:** R$ 157.539,45
4. **FILTROS:** R$ 138.593,33
5. **FREIOS:** R$ 122.880,41
6. **FRENAGEM:** R$ 44.407,25

---

### 3. Peças em Estoque que Nunca Foram Vendidas
**Total de peças paradas:** 5 tipos de peças
**Nome das peças paradas:** Filtro de Oleo Fras-le, Bomba d'Agua Monroe, MOLA HELICOIDAL FRAS-LE, Bieleta Valeo, Farol Dianteiro Cofap

**Detalhamento por item e estoque individual:**
* [Filtro de Oleo Fras-le] (SKU: PC-1036) — **22 unidades** em estoque
* [Bomba d'Agua Monroe] (SKU: PC-1031) — **17 unidades** em estoque
* [Farol Dianteiro Cofap] (SKU: PC-1044) — **17 unidades** em estoque
* [MOLA HELICOIDAL FRAS-LE] (SKU: PC-1020) — **10 unidades** em estoque
* [Bieleta Valeo] (SKU: PC-1022) — **10 unidades** em estoque

## Funcionalidades

- Painel com indicadores de faturamento, categorias que mais faturam e estoque parado
- Visualização das peças cadastradas
- Busca de peças por SKU
- Criação de peças
- Edição de peças
- Exclusão de peças
- Carregamento dos dados dos arquivos CSV para o banco de dados
- Acompanhamento do faturamento mensal por gráfico
- Filtro de peças por categoria

## Projeto online
https://case-autopecas-site.onrender.com

## Tecnologias

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express

### Banco de dados
- PostgreSQL
- Supabase

## Estrutura do projeto

```text
/
├── backend/
└── frontend/

## Como executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

### 2. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro da pasta `backend`:

```env
SUPABASE_URL=SUA_URL_DO_SUPABASE
SUPABASE_KEY=SUA_CHAVE_DO_SUPABASE
PORT=3000
```

Substitua os valores pelas credenciais do projeto Supabase.

### 3. Executar o backend

Ainda dentro da pasta `backend`:

```bash
npm run dev
```

O backend será iniciado localmente na porta `3000`.

### 4. Configurar o frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
npm install
```

Crie um arquivo `.env` dentro da pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

Essa variável indica o endereço da API utilizada pelo frontend.

### 5. Executar o frontend

Ainda dentro da pasta `frontend`:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente:

```text
http://localhost:5173
```

### 6. Carregar os dados

O projeto possui um script de importação dos arquivos CSV localizados em:

```text
backend/dados/
├── pecas.csv
└── vendas.csv
```

Com o backend configurado e as variáveis de ambiente preenchidas, execute:

```bash
cd backend
node scripts/importarDados.js
```

O script realiza o tratamento e a padronização dos dados antes de inseri-los no banco.

A importação pode ser executada novamente sem gerar duplicidades nos registros já existentes.
