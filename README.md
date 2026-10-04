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

- Painel com indicadores de faturamento, categorias que mais vendem e estoque parado
- Visualização das peças cadastradas
- Busca de peças por SKU
- Criação de peças
- Edição de peças
- Exclusão de peças
- Carregamento dos dados dos arquivos CSV para o banco de dados

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
