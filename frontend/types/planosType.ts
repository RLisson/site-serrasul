export type PlanoInternet = {
  id: string;
  nome: string;
  velocidade: string;
  preco: number;
  descricao: string;
  highlight: boolean;
  beneficios: string[];
  categoria: "internet";
  criadoEm: string;
};

export type PlanoInternetFormData = {
  nome: string;
  velocidade: string;
  preco: number;
  descricao: string;
  highlight: boolean;
  beneficios: string[];
};