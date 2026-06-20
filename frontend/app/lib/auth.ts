import { auth } from "./firebaseAdmin";

export async function verifyToken(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token de autenticação ausente ou inválido");
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch {
    throw new Error("Token de autenticação inválido");
  }
}