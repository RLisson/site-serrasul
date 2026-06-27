"use client";

import { clientAuth } from "@/app/lib/firebaseClient";
import { planosFixo, planosInternet, planosMovel } from "@/services/planos";
import { problemas } from "@/services/problemas";
import type {
  PlanoFixo,
  PlanoFixoFormData,
  PlanoInternet,
  PlanoInternetFormData,
  PlanoMovel,
  PlanoMovelFormData,
} from "@/types/planosType";
import type { Problem, ProblemFormData } from "@/types/problemType";
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
  LogOut,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type PlanoInternetFormState = {
  nome: string;
  velocidade: string;
  preco: string;
  descricao: string;
  highlight: boolean;
  beneficios: string;
};

type PlanoFixoFormState = {
  nome: string;
  preco: string;
  descricao: string;
};

type PlanoMovelFormState = {
  nome: string;
  preco: string;
  descricao: string;
  beneficios: string;
};

type ProblemFormState = {
  titulo: string;
  descricao: string;
  status: "aberto" | "resolvido";
  inicioEm: string;
  fimEstimado: string;
};

const emptyInternetFormState: PlanoInternetFormState = {
  nome: "",
  velocidade: "",
  preco: "",
  descricao: "",
  highlight: false,
  beneficios: "",
};

const emptyFixoFormState: PlanoFixoFormState = {
  nome: "",
  preco: "",
  descricao: "",
};

const emptyMovelFormState: PlanoMovelFormState = {
  nome: "",
  preco: "",
  descricao: "",
  beneficios: "",
};

const emptyProblemFormState: ProblemFormState = {
  titulo: "",
  descricao: "",
  status: "aberto",
  inicioEm: "",
  fimEstimado: "",
};

const toBenefits = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date).replace(",", " às");
};

const toDateTimeInputValue = (value: string) => {
  if (!value) {
    return "";
  }

  const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [internetPlans, setInternetPlans] = useState<PlanoInternet[]>([]);
  const [fixedPlans, setFixedPlans] = useState<PlanoFixo[]>([]);
  const [mobilePlans, setMobilePlans] = useState<PlanoMovel[]>([]);
  const [problemsList, setProblemsList] = useState<Problem[]>([]);

  const [loadingInternet, setLoadingInternet] = useState(false);
  const [loadingFixed, setLoadingFixed] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(false);

  const [savingInternet, setSavingInternet] = useState(false);
  const [savingFixed, setSavingFixed] = useState(false);
  const [savingMobile, setSavingMobile] = useState(false);
  const [savingProblem, setSavingProblem] = useState(false);

  const [deletingInternetId, setDeletingInternetId] = useState<string | null>(null);
  const [deletingFixedId, setDeletingFixedId] = useState<string | null>(null);
  const [deletingMobileId, setDeletingMobileId] = useState<string | null>(null);
  const [deletingProblemId, setDeletingProblemId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [problemSearchTerm, setProblemSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingInternet, setEditingInternet] = useState<PlanoInternet | null>(null);
  const [editingFixed, setEditingFixed] = useState<PlanoFixo | null>(null);
  const [editingMobile, setEditingMobile] = useState<PlanoMovel | null>(null);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const [internetForm, setInternetForm] = useState<PlanoInternetFormState>(emptyInternetFormState);
  const [fixedForm, setFixedForm] = useState<PlanoFixoFormState>(emptyFixoFormState);
  const [mobileForm, setMobileForm] = useState<PlanoMovelFormState>(emptyMovelFormState);
  const [problemForm, setProblemForm] = useState<ProblemFormState>(emptyProblemFormState);

  useEffect(() => {
    if (!clientAuth) {
      router.replace("/admin/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        setCurrentUser(null);
        setInternetPlans([]);
        setFixedPlans([]);
        setMobilePlans([]);
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

    void refreshInternetPlans();
    void refreshFixedPlans();
    void refreshMobilePlans();
    void refreshProblems();
  }, [currentUser]);

  const filteredInternetPlans = internetPlans.filter((plano) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [plano.nome, plano.velocidade, plano.descricao, plano.highlight ? "destacado" : ""].some((value) =>
      value.toLowerCase().includes(term),
    );
  });

  const filteredProblems = problemsList.filter((problem) => {
    const term = problemSearchTerm.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [problem.titulo, problem.descricao, problem.status, problem.inicioEm, problem.fimEstimado].some((value) =>
      value.toLowerCase().includes(term),
    );
  });

  function resetInternetForm() {
    setEditingInternet(null);
    setInternetForm(emptyInternetFormState);
  }

  function resetFixedForm() {
    setEditingFixed(null);
    setFixedForm(emptyFixoFormState);
  }

  function resetMobileForm() {
    setEditingMobile(null);
    setMobileForm(emptyMovelFormState);
  }

  function resetProblemForm() {
    setEditingProblem(null);
    setProblemForm(emptyProblemFormState);
  }

  function startEditingInternet(plano: PlanoInternet) {
    setEditingInternet(plano);
    setInternetForm({
      nome: plano.nome,
      velocidade: plano.velocidade,
      preco: String(plano.preco),
      descricao: plano.descricao,
      highlight: plano.highlight,
      beneficios: plano.beneficios.join("\n"),
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  function startEditingFixed(plano: PlanoFixo) {
    setEditingFixed(plano);
    setFixedForm({
      nome: plano.nome,
      preco: String(plano.preco),
      descricao: plano.descricao,
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  function startEditingMobile(plano: PlanoMovel) {
    setEditingMobile(plano);
    setMobileForm({
      nome: plano.nome,
      preco: String(plano.preco),
      descricao: plano.descricao,
      beneficios: plano.beneficios.join("\n"),
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  function startEditingProblem(problem: Problem) {
    setEditingProblem(problem);
    setProblemForm({
      titulo: problem.titulo,
      descricao: problem.descricao,
      status: problem.status,
      inicioEm: toDateTimeInputValue(problem.inicioEm),
      fimEstimado: toDateTimeInputValue(problem.fimEstimado),
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function refreshInternetPlans() {
    setLoadingInternet(true);

    try {
      const data = await planosInternet.getPlanosInternet();
      setInternetPlans(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar planos de internet");
    } finally {
      setLoadingInternet(false);
    }
  }

  async function refreshFixedPlans() {
    setLoadingFixed(true);

    try {
      const data = await planosFixo.getPlanosFixo();
      setFixedPlans(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar planos de telefonia fixa");
    } finally {
      setLoadingFixed(false);
    }
  }

  async function refreshMobilePlans() {
    setLoadingMobile(true);

    try {
      const data = await planosMovel.getPlanosMovel();
      setMobilePlans(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar planos de telefonia móvel");
    } finally {
      setLoadingMobile(false);
    }
  }

  async function refreshProblems() {
    setLoadingProblems(true);

    try {
      const data = await problemas.getProblemas();
      setProblemsList(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar problemas");
    } finally {
      setLoadingProblems(false);
    }
  }

  async function handleInternetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingInternet(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload: PlanoInternetFormData = {
      nome: internetForm.nome.trim(),
      velocidade: internetForm.velocidade.trim(),
      preco: Number(internetForm.preco),
      descricao: internetForm.descricao.trim(),
      highlight: internetForm.highlight,
      beneficios: toBenefits(internetForm.beneficios),
    };

    if (
      !payload.nome ||
      !payload.velocidade ||
      Number.isNaN(payload.preco) ||
      !payload.descricao ||
      payload.beneficios.length === 0
    ) {
      setSavingInternet(false);
      setErrorMessage("Preencha todos os campos e adicione pelo menos um benefício.");
      return;
    }

    try {
      if (editingInternet) {
        await planosInternet.updatePlanoInternet(editingInternet.id, payload);
        setSuccessMessage("Plano de internet atualizado com sucesso.");
      } else {
        await planosInternet.createPlanoInternet(payload);
        setSuccessMessage("Plano de internet criado com sucesso.");
      }

      await refreshInternetPlans();
      resetInternetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao salvar plano de internet");
    } finally {
      setSavingInternet(false);
    }
  }

  async function handleFixedSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingFixed(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload: PlanoFixoFormData = {
      nome: fixedForm.nome.trim(),
      preco: Number(fixedForm.preco),
      descricao: fixedForm.descricao.trim(),
    };

    if (!payload.nome || Number.isNaN(payload.preco) || !payload.descricao) {
      setSavingFixed(false);
      setErrorMessage("Preencha todos os campos do plano de telefonia fixa.");
      return;
    }

    try {
      if (editingFixed) {
        await planosFixo.updatePlanoFixo(editingFixed.id, payload);
        setSuccessMessage("Plano de telefonia fixa atualizado com sucesso.");
      } else {
        await planosFixo.createPlanoFixo(payload);
        setSuccessMessage("Plano de telefonia fixa criado com sucesso.");
      }

      await refreshFixedPlans();
      resetFixedForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao salvar plano de telefonia fixa");
    } finally {
      setSavingFixed(false);
    }
  }

  async function handleMobileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingMobile(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload: PlanoMovelFormData = {
      nome: mobileForm.nome.trim(),
      preco: Number(mobileForm.preco),
      descricao: mobileForm.descricao.trim(),
      beneficios: toBenefits(mobileForm.beneficios),
    };

    if (!payload.nome || Number.isNaN(payload.preco) || !payload.descricao || payload.beneficios.length === 0) {
      setSavingMobile(false);
      setErrorMessage("Preencha todos os campos e adicione pelo menos um benefício.");
      return;
    }

    try {
      if (editingMobile) {
        await planosMovel.updatePlanoMovel(editingMobile.id, payload);
        setSuccessMessage("Plano móvel atualizado com sucesso.");
      } else {
        await planosMovel.createPlanoMovel(payload);
        setSuccessMessage("Plano móvel criado com sucesso.");
      }

      await refreshMobilePlans();
      resetMobileForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao salvar plano móvel");
    } finally {
      setSavingMobile(false);
    }
  }

  async function handleProblemSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProblem(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload: ProblemFormData = {
      titulo: problemForm.titulo.trim(),
      descricao: problemForm.descricao.trim(),
      status: problemForm.status,
      inicioEm: problemForm.inicioEm.trim(),
      fimEstimado: problemForm.fimEstimado.trim(),
    };

    if (!payload.titulo || !payload.descricao || !payload.inicioEm || !payload.fimEstimado) {
      setSavingProblem(false);
      setErrorMessage("Preencha todos os campos do problema.");
      return;
    }

    try {
      if (editingProblem) {
        await problemas.updateProblema(editingProblem.id, payload);
        setSuccessMessage("Problema atualizado com sucesso.");
      } else {
        await problemas.createProblema(payload);
        setSuccessMessage("Problema criado com sucesso.");
      }

      await refreshProblems();
      resetProblemForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao salvar problema");
    } finally {
      setSavingProblem(false);
    }
  }

  async function handleDeleteInternet(id: string) {
    if (!window.confirm("Remover este plano de internet?")) {
      return;
    }

    setDeletingInternetId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await planosInternet.deletePlanoInternet(id);
      await refreshInternetPlans();
      if (editingInternet?.id === id) {
        resetInternetForm();
      }
      setSuccessMessage("Plano de internet removido com sucesso.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao remover plano de internet");
    } finally {
      setDeletingInternetId(null);
    }
  }

  async function handleDeleteFixed(id: string) {
    if (!window.confirm("Remover este plano de telefonia fixa?")) {
      return;
    }

    setDeletingFixedId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await planosFixo.deletePlanoFixo(id);
      await refreshFixedPlans();
      if (editingFixed?.id === id) {
        resetFixedForm();
      }
      setSuccessMessage("Plano de telefonia fixa removido com sucesso.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao remover plano de telefonia fixa");
    } finally {
      setDeletingFixedId(null);
    }
  }

  async function handleDeleteMobile(id: string) {
    if (!window.confirm("Remover este plano móvel?")) {
      return;
    }

    setDeletingMobileId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await planosMovel.deletePlanoMovel(id);
      await refreshMobilePlans();
      if (editingMobile?.id === id) {
        resetMobileForm();
      }
      setSuccessMessage("Plano móvel removido com sucesso.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao remover plano móvel");
    } finally {
      setDeletingMobileId(null);
    }
  }

  async function handleDeleteProblem(id: string) {
    if (!window.confirm("Remover este problema?")) {
      return;
    }

    setDeletingProblemId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await problemas.deleteProblema(id);
      await refreshProblems();
      if (editingProblem?.id === id) {
        resetProblemForm();
      }
      setSuccessMessage("Problema removido com sucesso.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao remover problema");
    } finally {
      setDeletingProblemId(null);
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

  function handleLogout(): void {
    if (clientAuth) {
      clientAuth.signOut().then(() => {
        router.replace("/admin/login");
      });
    }
    setErrorMessage("");
    setSuccessMessage("");
    setInternetPlans([]);
    setFixedPlans([]);
    setMobilePlans([]);
    setProblemsList([]);
    setEditingInternet(null);
    setEditingFixed(null);
    setEditingMobile(null);
    setEditingProblem(null);
    setInternetForm(emptyInternetFormState);
    setFixedForm(emptyFixoFormState);
    setMobileForm(emptyMovelFormState);
    setProblemForm(emptyProblemFormState);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#071522_0%,#0b1f33_34%,#f2f2f2_34%,#f2f2f2_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-4xl border border-white/10 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/30 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/45">Admin</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Planos e problemas</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Crie, edite, busque e remova planos e problemas sem sair do painel.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5 bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              Sair
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
                  {editingInternet ? "Editar plano" : "Novo plano"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use quebras de linha para separar os benefícios.
                </p>
              </div>
              {editingInternet && (
                <button
                  type="button"
                  onClick={resetInternetForm}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar edição
                </button>
              )}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleInternetSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nome
                  <input
                    value={internetForm.nome}
                    onChange={(event) => setInternetForm((current) => ({ ...current, nome: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="400 Mega"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Velocidade
                  <input
                    value={internetForm.velocidade}
                    onChange={(event) => setInternetForm((current) => ({ ...current, velocidade: event.target.value }))}
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
                    value={internetForm.preco}
                    onChange={(event) => setInternetForm((current) => ({ ...current, preco: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="119.90"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Destaque
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={internetForm.highlight}
                      onChange={(event) => setInternetForm((current) => ({ ...current, highlight: event.target.checked }))}
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
                  value={internetForm.descricao}
                  onChange={(event) => setInternetForm((current) => ({ ...current, descricao: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Descreva o plano..."
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Benefícios
                <textarea
                  rows={5}
                  value={internetForm.beneficios}
                  onChange={(event) => setInternetForm((current) => ({ ...current, beneficios: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Wi-Fi de alta performance\nInstalação rápida\nSuporte local"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={savingInternet}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingInternet ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingInternet ? "Salvar alterações" : "Criar plano"}
                </button>
                <button
                  type="button"
                  onClick={resetInternetForm}
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
                  <p className="mt-1 text-sm text-slate-500">{filteredInternetPlans.length} plano(s) encontrado(s)</p>
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
                {loadingInternet ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando planos...
                  </div>
                ) : filteredInternetPlans.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    Nenhum plano encontrado.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredInternetPlans.map((plano) => (
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
                            <p className="mt-3 text-xl font-black text-slate-950">{formatCurrency(plano.preco)}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingInternet(plano)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <PencilLine className="h-4 w-4" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteInternet(plano.id)}
                              disabled={deletingInternetId === plano.id}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {deletingInternetId === plano.id ? (
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
                            <span key={beneficio} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
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

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editingFixed ? "Editar plano de telefonia fixa" : "Novo plano de telefonia fixa"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Cadastro no mesmo padrão dos planos de internet.</p>
              </div>
              {editingFixed && (
                <button
                  type="button"
                  onClick={resetFixedForm}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar edição
                </button>
              )}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleFixedSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nome
                  <input
                    value={fixedForm.nome}
                    onChange={(event) => setFixedForm((current) => ({ ...current, nome: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="Plano Fixo"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Preço
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fixedForm.preco}
                    onChange={(event) => setFixedForm((current) => ({ ...current, preco: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="49.90"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descrição
                <textarea
                  rows={4}
                  value={fixedForm.descricao}
                  onChange={(event) => setFixedForm((current) => ({ ...current, descricao: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Descreva o plano..."
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={savingFixed}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingFixed ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingFixed ? "Salvar alterações" : "Criar plano"}
                </button>
                <button
                  type="button"
                  onClick={resetFixedForm}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar formulário
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">Lista de telefonia fixa</h2>
            <div className="mt-6 grid gap-4">
              {loadingFixed ? (
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Carregando planos de telefonia fixa...</p>
                </div>
              ) : fixedPlans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Nenhum plano de telefonia fixa encontrado.
                </div>
              ) : (
                fixedPlans.map((plano) => (
                  <article key={plano.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{plano.nome}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{plano.descricao}</p>
                        <p className="mt-3 text-xl font-black text-slate-950">{formatCurrency(plano.preco)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEditingFixed(plano)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <PencilLine className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteFixed(plano.id)}
                          disabled={deletingFixedId === plano.id}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingFixedId === plano.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Excluir
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editingMobile ? "Editar plano móvel" : "Novo plano móvel"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Cadastro no mesmo padrão dos planos de internet.</p>
              </div>
              {editingMobile && (
                <button
                  type="button"
                  onClick={resetMobileForm}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar edição
                </button>
              )}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleMobileSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nome
                  <input
                    value={mobileForm.nome}
                    onChange={(event) => setMobileForm((current) => ({ ...current, nome: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="Plano 30 GB"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Preço
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={mobileForm.preco}
                    onChange={(event) => setMobileForm((current) => ({ ...current, preco: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="49.90"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descrição
                <textarea
                  rows={4}
                  value={mobileForm.descricao}
                  onChange={(event) => setMobileForm((current) => ({ ...current, descricao: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Descreva o plano..."
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Benefícios
                <textarea
                  rows={5}
                  value={mobileForm.beneficios}
                  onChange={(event) => setMobileForm((current) => ({ ...current, beneficios: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="WhatsApp grátis\nLigações ilimitadas\nRoaming nacional"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={savingMobile}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingMobile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingMobile ? "Salvar alterações" : "Criar plano"}
                </button>
                <button
                  type="button"
                  onClick={resetMobileForm}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar formulário
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">Lista de telefonia móvel</h2>
            <div className="mt-6 grid gap-4">
              {loadingMobile ? (
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Carregando planos de telefonia móvel...</p>
                </div>
              ) : mobilePlans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Nenhum plano de telefonia móvel encontrado.
                </div>
              ) : (
                mobilePlans.map((plano) => (
                  <article key={plano.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{plano.nome}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{plano.descricao}</p>
                        <p className="mt-3 text-xl font-black text-slate-950">{formatCurrency(plano.preco)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEditingMobile(plano)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <PencilLine className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteMobile(plano.id)}
                          disabled={deletingMobileId === plano.id}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingMobileId === plano.id ? (
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
                        <span key={beneficio} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {beneficio}
                        </span>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {editingProblem ? "Editar problema" : "Novo problema"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Cadastro no mesmo padrão dos planos.</p>
              </div>
              {editingProblem && (
                <button
                  type="button"
                  onClick={resetProblemForm}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar edição
                </button>
              )}
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleProblemSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Título
                  <input
                    value={problemForm.titulo}
                    onChange={(event) => setProblemForm((current) => ({ ...current, titulo: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                    placeholder="Bairro São José"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Status
                  <select
                    value={problemForm.status}
                    onChange={(event) =>
                      setProblemForm((current) => ({ ...current, status: event.target.value as ProblemFormState["status"] }))
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  >
                    <option value="aberto">Aberto</option>
                    <option value="resolvido">Resolvido</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Início em
                  <input
                    type="datetime-local"
                    value={problemForm.inicioEm}
                    onChange={(event) => setProblemForm((current) => ({ ...current, inicioEm: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Fim estimado
                  <input
                    type="datetime-local"
                    value={problemForm.fimEstimado}
                    onChange={(event) => setProblemForm((current) => ({ ...current, fimEstimado: event.target.value }))}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descrição
                <textarea
                  rows={5}
                  value={problemForm.descricao}
                  onChange={(event) => setProblemForm((current) => ({ ...current, descricao: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                  placeholder="Descreva o problema..."
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={savingProblem}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingProblem ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingProblem ? "Salvar alterações" : "Criar problema"}
                </button>
                <button
                  type="button"
                  onClick={resetProblemForm}
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
                  <h2 className="text-2xl font-black text-slate-950">Lista de problemas</h2>
                  <p className="mt-1 text-sm text-slate-500">{filteredProblems.length} problema(s) encontrado(s)</p>
                </div>
                <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={problemSearchTerm}
                    onChange={(event) => setProblemSearchTerm(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="Buscar problema"
                  />
                </label>
              </div>

              <div className="mt-2">
                {loadingProblems ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando problemas...
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    Nenhum problema encontrado.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredProblems.map((problem) => (
                      <article key={problem.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-950">{problem.titulo}</h3>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
                                  problem.status === "resolvido"
                                    ? "bg-emerald-200 text-emerald-900"
                                    : "bg-amber-200 text-amber-900"
                                }`}
                              >
                                {problem.status}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{problem.descricao}</p>
                            <p className="mt-3 text-sm font-medium text-slate-500">
                              Início: {formatDateTime(problem.inicioEm)} · Previsão: {formatDateTime(problem.fimEstimado)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingProblem(problem)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <PencilLine className="h-4 w-4" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteProblem(problem.id)}
                              disabled={deletingProblemId === problem.id}
                              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {deletingProblemId === problem.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Excluir
                            </button>
                          </div>
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
