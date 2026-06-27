import { api } from "@/app/lib/api";
import { clientAuth } from "@/app/lib/firebaseClient";
import type {
  PlanoFixo,
  PlanoFixoFormData,
  PlanoInternet,
  PlanoInternetFormData,
  PlanoMovel,
  PlanoMovelFormData,
} from "@/types/planosType";

const planosBaseUrl = "/planos/internet";

async function buildAuthHeaders() {
  const currentUser = clientAuth?.currentUser;

  if (!currentUser) {
    throw new Error("Usuário não autenticado");
  }

  const token = await currentUser.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const planosInternet = {
  getPlanosInternet: async () => {
    const response = await api.get<{ success: boolean; data: PlanoInternet[] }>(planosBaseUrl);
    const data = response.data;
    return data.data;
  },
  createPlanoInternet: async (plano: PlanoInternetFormData) => {
    const response = await api.post<{ success: boolean; data: PlanoInternet }>(planosBaseUrl, plano, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  updatePlanoInternet: async (id: string, plano: PlanoInternetFormData) => {
    const response = await api.put<{ success: boolean; data: PlanoInternet }>(planosBaseUrl, {
      id,
      ...plano,
    }, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  deletePlanoInternet: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(planosBaseUrl, {
      data: { id },
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.message;
  },
};

export const planosFixo = {
  getPlanosFixo: async () => {
    const response = await api.get<{ success: boolean; data: PlanoFixo[] }>("/planos/fixo");
    const data = response.data;
    return data.data;
  },
  createPlanoFixo: async (plano: PlanoFixoFormData) => {
    const response = await api.post<{ success: boolean; data: PlanoFixo }>("/planos/fixo", plano, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  updatePlanoFixo: async (id: string, plano: PlanoFixoFormData) => {
    const response = await api.put<{ success: boolean; data: PlanoFixo }>("/planos/fixo", {
      id,
      ...plano,
    }, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  deletePlanoFixo: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>("/planos/fixo", {
      data: { id },
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.message;
  },
};

export const planosMovel = {
  getPlanosMovel: async () => {
    const response = await api.get<{ success: boolean; data: PlanoMovel[] }>("/planos/movel");
    const data = response.data;
    return data.data;
  },
  createPlanoMovel: async (plano: PlanoMovelFormData) => {
    const response = await api.post<{ success: boolean; data: PlanoMovel }>("/planos/movel", plano, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  updatePlanoMovel: async (id: string, plano: PlanoMovelFormData) => {
    const response = await api.put<{ success: boolean; data: PlanoMovel }>("/planos/movel", {
      id,
      ...plano,
    }, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  deletePlanoMovel: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>("/planos/movel", {
      data: { id },
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.message;
  },
};
