import { api } from "@/app/lib/api";
import { clientAuth } from "@/app/lib/firebaseClient";
import { Problem, ProblemFormData } from "@/types/problemType";

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

export const problemas = {
  getProblemas: async () => {
    const response = await api.get<{ success: boolean; data: Problem[] }>("/problemas");
    const data = response.data;
    return data.data;
  },
  createProblema: async (problema: ProblemFormData) => {
    const response = await api.post<{ success: boolean; data: Problem }>("/problemas", problema, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  updateProblema: async (id: string, problema: ProblemFormData) => {
    const response = await api.put<{ success: boolean; data: Problem }>("/problemas", {
      id,
      ...problema,
    }, {
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.data;
  },
  deleteProblema: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>("/problemas", {
      data: { id },
      headers: {
        ...(await buildAuthHeaders()),
      },
    });
    const data = response.data;
    return data.message;
  },
};