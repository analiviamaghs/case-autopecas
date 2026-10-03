import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Icon({ name, size = 20 }) {
  const paths = {
    box: <><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="m3 8 9 5 9-5M12 13v9M21 8v9l-9 5-9-5V8" /></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7Z" />,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    spark: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/painel`);
        const result = response.data.dados || response.data;
        setData(result);
      } catch (err) {
        console.error("Erro ao carregar o painel:", err);
        setError("Não foi possível carregar as métricas do painel.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Carregando métricas analíticas...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-600 font-medium">{error || "Erro ao carregar dados."}</div>;

  const topCategory = data.top_categorias[0] || { categoria: "N/A", faturamento_total: 0 };
  const maxCategoryValue = Math.max(...data.top_categorias.map((c) => Number(c.faturamento_total) || 1), 1);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-950">Visão geral</p>
          <p className="mt-1 text-sm text-slate-500">Acompanhe os resultados das três lojas em um só lugar.</p>
        </div>

      </div>

      {/* Resposta 1: Faturamento Líquido Total */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 border-b border-slate-100 p-5 lg:grid-cols-[0.7fr_1.5fr] lg:p-6">
          <div className="flex flex-col justify-center">
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">1</div>
            <p className="text-sm font-semibold text-slate-500">Qual o faturamento líquido total?</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {money.format(Number(data.faturamento_total) || 0)}
            </p>
            <p className="mt-2 text-xs text-slate-500"><span className="font-semibold text-emerald-600">Calculado</span> com base nas vendas concluídas</p>
          </div>
          <div>
          </div>
        </div>
      </div>

      {/* Resposta 2: Categorias */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.5fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">2</div>
            <p className="text-sm font-semibold text-slate-500">Quais categorias de peça mais faturaram?</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{topCategory.categoria}</p>
            <p className="mt-2 text-sm font-semibold text-blue-700">{money.format(Number(topCategory.faturamento_total) || 0)}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Faturamento por categoria</p>
            <p className="mt-1 text-xs text-slate-500">Categorias ordenadas pela receita líquida</p>
            <div className="mt-5 space-y-4">
              {data.top_categorias.map((cat) => {
                const val = Number(cat.faturamento_total) || 0;
                const percent = Math.min(Math.round((val / maxCategoryValue) * 100), 100);
                return (
                  <div key={cat.categoria}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat.categoria}</span>
                      <span className="font-semibold text-slate-900">{money.format(val)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Resposta 3: Parados */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 border-b border-slate-100 p-5 lg:grid-cols-[0.7fr_1.5fr] lg:p-6">
          <div>
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-amber-50 font-bold text-amber-700">3</div>
            <p className="text-sm font-semibold text-slate-500">Quantas peças têm estoque e nunca foram vendidas?</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{data.estoque_parado.total_pecas_sem_venda} peças</p>
            <p className="mt-2 text-xs font-semibold text-amber-700">{data.estoque_parado.itens.length} produtos em catálogo sem vendas</p>
          </div>
          <div className="flex items-center rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Estes itens possuem estoque positivo na prateleira, mas nenhuma venda registrada no primeiro semestre.
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Lista de peças nunca vendidas</p>
              <p className="mt-1 text-xs text-slate-500">Itens com estoque atual maior que zero e nenhuma venda registrada</p>
            </div>
            <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{data.estoque_parado.itens.length} produtos</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Nome da peça</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-right">Estoque atual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.estoque_parado.itens.map((part) => (
                  <tr key={part.sku}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{part.sku}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{part.nome_peca}</td>
                    <td className="px-4 py-3 text-slate-600">{part.categoria}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{part.estoque_atual} un.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Parts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/pecas`);
      const result = response.data.dados || response.data;
      setParts(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Erro ao buscar peças:", err);
      alert("Falha ao carregar lista de peças da API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const filtered = useMemo(() => {
    return parts.filter((part) => {
      const categoryMatch = category === "Todas" || part.categoria === category;
      return categoryMatch;
    });
  }, [parts, appliedSearch, category]);

  function openForm(part) {
    setEditing(part ?? null);
    setModalOpen(true);
  }

  async function remove(part) {
    const idParam = part.sku;
    if (window.confirm(`Excluir "${part.nome_peca}" (SKU: ${idParam})? Esta ação não pode ser desfeita.`)) {
      try {
        await axios.delete(`${API_URL}/pecas/${idParam}`);
        fetchParts();
      } catch (err) {
        console.error("Erro ao excluir peça:", err);
        alert("Não foi possível excluir a peça.");
      }
    }
  }

  async function searchPecaBySku() {
    const sku = search.trim();

    if (!sku) {
      setAppliedSearch("");
      fetchParts();
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/pecas/${encodeURIComponent(sku)}`
      );

      const result = response.data.dados || response.data;

      setParts(result ? [result] : []);
    } catch (err) {
      console.error("Erro ao buscar peça:", err);

      if (err.response?.status === 404) {
        setParts([]);
      } else {
        alert(
          err.response?.data?.mensagem ||
          "Não foi possível buscar a peça."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return [...new Set(parts.map((p) => p.categoria).filter(Boolean))];
  }, [parts]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-950">Peças</p>
          <p className="mt-1 text-sm text-slate-500">Gerencie o catálogo e o estoque das suas lojas.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
          <Icon name="plus" size={18} /> Nova peça
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
          <form onSubmit={(event) => { event.preventDefault(); searchPecaBySku(); }} className="flex min-w-64 flex-1">
            <label className="relative flex-1">
              <span className="sr-only">Buscar pelo SKU</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar exclusivamente pelo SKU" className="w-full rounded-l-xl border border-r-0 border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <button type="submit" aria-label="Buscar SKU" className="grid w-12 place-items-center rounded-r-xl bg-blue-700 text-white transition hover:bg-blue-800">
              <Icon name="search" size={19} />
            </button>
          </form>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-600">
            <Icon name="filter" size={17} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-full bg-transparent pr-2 font-medium outline-none">
              <option>Todas</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Carregando catálogo...</div>
          ) : (
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">SKU</th>
                  <th className="px-4 py-3.5">Nome da peça</th>
                  <th className="px-4 py-3.5">Categoria</th>
                  <th className="px-4 py-3.5">Custo unitário</th>
                  <th className="px-4 py-3.5">Fornecedor</th>
                  <th className="px-4 py-3.5">Estoque atual</th>
                  <th className="px-5 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((part) => (
                  <tr key={part.sku} className="text-sm transition hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-blue-700">{part.sku}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{part.nome_peca}</td>
                    <td className="px-4 py-4 text-slate-600">{part.categoria}</td>
                    <td className="px-4 py-4 font-medium text-slate-800">{money.format(Number(part.custo_unitario) || 0)}</td>
                    <td className="px-4 py-4 text-slate-600">{part.fornecedor || "—"}</td>
                    <td className="px-4 py-4">
                      <span className={`font-semibold ${part.estoque_atual <= 8 ? "text-amber-700" : "text-slate-700"}`}>{part.estoque_atual} un.</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openForm(part)} aria-label={`Editar ${part.nome_peca}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700">
                          <Icon name="edit" size={18} />
                        </button>
                        <button onClick={() => remove(part)} aria-label={`Excluir ${part.nome_peca}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                          <Icon name="trash" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && <div className="py-14 text-center text-sm text-slate-500">Nenhuma peça encontrada com esses filtros.</div>}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>Mostrando {filtered.length} de {parts.length} peças</span>
          <span>Estoque total: <strong className="text-slate-700">{parts.reduce((sum, part) => sum + (Number(part.estoque_atual) || 0), 0)} unidades</strong></span>
        </div>
      </div>

      {modalOpen && (
        <PartModal
          part={editing}
          onClose={() => setModalOpen(false)}
          onSave={async (savedPart) => {
            try {
              if (editing) {
                await axios.put(
                  `${API_URL}/pecas/${editing.sku}`, {
                  nome_peca: savedPart.nome_peca,
                  categoria: savedPart.categoria,
                  fornecedor: savedPart.fornecedor,
                  estoque_atual: savedPart.estoque_atual,
                  custo_unitario: savedPart.custo_unitario
                });
              } else {
                await axios.post(`${API_URL}/pecas`, savedPart);
              }
              setModalOpen(false);
              fetchParts();
            } catch (err) {
              console.error("Erro ao salvar peça:", err);
              alert(err.response?.data?.mensagem || "Erro ao salvar informações da peça.");
            }
          }}
        />
      )}
    </section>
  );
}

function PartModal({ part, onClose, onSave }) {
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: String(form.get("sku")),
      nome_peca: String(form.get("nome_peca")),
      categoria: String(form.get("categoria")),
      fornecedor: String(form.get("fornecedor")),
      estoque_atual: Number(form.get("estoque_atual")),
      custo_unitario: Number(form.get("custo_unitario")),
    });
  }

  const fieldClass = "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={submit} className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-lg font-bold text-slate-900">{part ? "Editar peça" : "Cadastrar nova peça"}</p>
            <p className="mt-1 text-xs text-slate-500">Preencha as informações do produto.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <Icon name="close" />
          </button>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
            Nome da peça
            <input required name="nome_peca" defaultValue={part?.nome_peca} className={fieldClass} placeholder="Ex.: Pastilha de freio dianteira" />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            SKU
            <input required name="sku" defaultValue={part?.sku} className={fieldClass} placeholder="PAS-001" disabled={!!part} />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Fornecedor
            <input name="fornecedor" defaultValue={part?.fornecedor} className={fieldClass} placeholder="Ex.: Bosch Distribuidora" />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Categoria
            <input required name="categoria" defaultValue={part?.categoria ?? "Motor"} className={fieldClass} placeholder="Ex.: Freios, Motor, Suspensão" />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Quantidade em estoque
            <input required min="0" type="number" name="estoque_atual" defaultValue={part?.estoque_atual ?? 0} className={fieldClass} />
          </label>
          <label className="text-xs font-semibold text-slate-600 sm:col-span-2">
            Custo unitário (R$)
            <input required min="0" step="0.01" type="number" name="custo_unitario" defaultValue={part?.custo_unitario} className={fieldClass} placeholder="0,00" />
          </label>
        </div>
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
          <button type="submit" className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">{part ? "Salvar alterações" : "Cadastrar peça"}</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const nav = [
    { id: "dashboard", label: "Painel", icon: "grid" },
    { id: "parts", label: "Peças", icon: "box" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileMenu && <div className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setMobileMenu(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white transition-transform lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-600">
            <Icon name="gear" size={23} />
          </span>
          <div>
            <p className="font-bold tracking-tight">AutoPeças Andrade</p>
            <p className="text-xs text-slate-400">Gestão das três lojas</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Menu principal</p>
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setMobileMenu(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${view === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon name={item.icon} size={19} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              <Icon name="menu" />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-800">{view === "dashboard" ? "Painel analítico" : "Cadastro de peças"}</p>
              <p className="text-xs text-slate-500">AutoPeças Andrade</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-3 text-xs font-medium text-slate-600 shadow-sm sm:flex">
            <span className="size-2 rounded-full bg-emerald-500" /> Dados atualizados
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 md:p-8">
          {view === "dashboard" ? <Dashboard /> : <Parts />}
        </div>
      </main>
    </div>
  );
}