import { api } from "@/app/lib/api";
import { clientAuth } from "@/app/lib/firebaseClient";
import type { PlanoInternet, PlanoInternetFormData } from "@/types/planosType";

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
    const response = await api.get<{ success: boolean; data: PlanoInternet[] }>(planosBaseUrl, {
      headers: await buildAuthHeaders(),
    });
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