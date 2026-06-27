"use client";

import { clientAuth } from "@/app/lib/firebaseClient";
import { planosInternet } from "@/services/planos";
import type { PlanoInternet, PlanoInternetFormData } from "@/types/planosType";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  AlertCircle,
  Check,
  Loader2,
  PencilLine,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PlanoFormState = {
  nome: string;
  velocidade: string;
  preco: string;
  descricao: string;
  highlight: boolean;
  beneficios: string;
};

const emptyFormState: PlanoFormState = {
  nome: "",
  velocidade: "",
  preco: "",
  descricao: "",
  highlight: false,
  beneficios: "",
};

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [planos, setPlanos] = useState<PlanoInternet[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [savingPlano, setSavingPlano] = useState(false);
  const [deletingPlanoId, setDeletingPlanoId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingPlano, setEditingPlano] = useState<PlanoInternet | null>(null);
  const [formState, setFormState] = useState<PlanoFormState>(emptyFormState);

  useEffect(() => {
    if (!clientAuth) {
      router.replace("/admin/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        setCurrentUser(null);
        setPlanos([]);
      } else {
        setCurrentUser(user);
      }

      setCheckingAuth(false);
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const fetchPlanos = async () => {
      setLoadingPlanos(true);
      setErrorMessage("");

      try {
        const data = await planosInternet.getPlanosInternet();
        setPlanos(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar planos");
      } finally {
        setLoadingPlanos(false);
      }
    };

    void fetchPlanos();
  }, [currentUser]);

  const filteredPlanos = planos.filter((plano) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [plano.nome, plano.velocidade, plano.descricao, plano.highlight ? "destacado" : ""].some((value) =>
      value.toLowerCase().includes(term),
    );
  });

  function resetForm() {
    setEditingPlano(null);
    setFormState(emptyFormState);
  }

  function startEditingPlano(plano: PlanoInternet) {
    setEditingPlano(plano);
    setFormState({
      nome: plano.nome,
      velocidade: plano.velocidade,
      preco: String(plano.preco),
      descricao: plano.descricao,
      highlight: plano.highlight,
      beneficios: plano.beneficios.join("\n"),
    });
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function refreshPlanos() {
    const data = await planosInternet.getPlanosInternet();
    setPlanos(data);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPlano(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload: PlanoInternetFormData = {
      nome: formState.nome.trim(),
      velocidade: formState.velocidade.trim(),
      preco: Number(formState.preco),
      descricao: formState.descricao.trim(),
      highlight: formState.highlight,
      beneficios: formState.beneficios
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (
      !payload.nome ||
      !payload.velocidade ||
      Number.isNaN(payload.preco) ||
      !payload.descricao ||
      payload.beneficios.length === 0
    ) {
      setSavingPlano(false);
      setErrorMessage("Preencha todos os campos e adicione pelo menos um benefício.");
      return;
    }

    try {
      if (editingPlano) {
        await planosInternet.updatePlanoInternet(editingPlano.id, payload);
        setSuccessMessage("Plano atualizado com sucesso.");
      } else {
        await planosInternet.createPlanoInternet(payload);
        setSuccessMessage("Plano criado com sucesso.");
      }

      await refreshPlanos();
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao salvar plano");
    } finally {
      setSavingPlano(false);
    }
  }

  async function handleDeletePlano(planoId: string) {
    const shouldDelete = window.confirm("Remover este plano?");

    if (!shouldDelete) {
      return;
    }

    setDeletingPlanoId(planoId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await planosInternet.deletePlanoInternet(planoId);
      await refreshPlanos();
      if (editingPlano?.id === planoId) {
        resetForm();
      }
      setSuccessMessage("Plano removido com sucesso.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao remover plano");
    } finally {
      setDeletingPlanoId(null);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-white/70">Verificando acesso...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#071522_0%,#0b1f33_34%,#f2f2f2_34%,#f2f2f2_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-4xl border border-white/10 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/30 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/45">Admin</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Planos de Internet</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Crie, edite, busque e remova planos sem sair do painel.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
              Novo plano
            </button>
          </div>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${errorMessage
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
          >
            {errorMessage ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p>{errorMessage || successMessage}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editingPlano ? "Editar plano" : "Novo plano"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use quebras de linha para separar os benefícios.
                </p>
              </div>
              {editingPlano && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar edição
                </button>
              )}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nome
                  <input
                    value={formState.nome}
                    onChange={(event) => setFormState((current) => ({ ...current, nome: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="400 Mega"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Velocidade
                  <input
                    value={formState.velocidade}
                    onChange={(event) => setFormState((current) => ({ ...current, velocidade: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="400 Mbps"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Preço
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.preco}
                    onChange={(event) => setFormState((current) => ({ ...current, preco: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="119.90"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Destaque
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={formState.highlight}
                      onChange={(event) => setFormState((current) => ({ ...current, highlight: event.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-slate-950"
                    />
                    <span className="text-sm text-slate-600">Marcar como plano destacado</span>
                  </div>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descrição
                <textarea
                  rows={4}
                  value={formState.descricao}
                  onChange={(event) => setFormState((current) => ({ ...current, descricao: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Descreva o plano..."
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Benefícios
                <textarea
                  rows={5}
                  value={formState.beneficios}
                  onChange={(event) => setFormState((current) => ({ ...current, beneficios: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Wi-Fi de alta performance\nInstalação rápida\nSuporte local"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={savingPlano}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingPlano ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingPlano ? "Salvar alterações" : "Criar plano"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar formulário
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Lista de planos</h2>
                  <p className="mt-1 text-sm text-slate-500">{filteredPlanos.length} plano(s) encontrado(s)</p>
                </div>
                <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="Buscar plano"
                  />
                </label>
              </div>

              <div className="mt-2">
                {loadingPlanos ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando planos...
                  </div>
                ) : filteredPlanos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    Nenhum plano encontrado.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredPlanos.map((plano) => (
                      <article
                        key={plano.id}
                        className={`rounded-3xl border p-5 shadow-sm transition ${plano.highlight
                          ? "border-amber-300 bg-amber-50/70"
                          : "border-slate-200 bg-white"
                          }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-950">{plano.nome}</h3>
                              {plano.highlight && (
                                <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-900">
                                  Destaque
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{plano.velocidade}</p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{plano.descricao}</p>
                            <p className="mt-3 text-xl font-black text-slate-950">
                              {plano.preco.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingPlano(plano)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <PencilLine className="h-4 w-4" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeletePlano(plano.id)}
                              disabled={deletingPlanoId === plano.id}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {deletingPlanoId === plano.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Excluir
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {plano.beneficios.map((beneficio) => (
                            <span
                              key={beneficio}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              {beneficio}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}