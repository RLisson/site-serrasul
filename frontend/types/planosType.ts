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

export type PlanoFixo = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
};

export type PlanoFixoFormData = {
  nome: string;
  descricao: string;
  preco: number;
};

export type PlanoMovel = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  beneficios: string[];
  categoria: "movel";
  criadoEm: string;
};

export type PlanoMovelFormData = {
  nome: string;
  descricao: string;
  preco: number;
  beneficios: string[];
};