export type Problem = {
  id: string;
  titulo: string;
  descricao: string;
  status: "aberto" | "resolvido";
  inicioEm: string;
  fimEstimado: string;
};

export type ProblemFormData = {
  titulo: string;
  descricao: string;
  status: "aberto" | "resolvido";
  inicioEm: string;
  fimEstimado: string;
};
