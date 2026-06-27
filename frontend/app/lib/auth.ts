import { getAuth } from "./firebaseAdmin";

export async function verifyToken(request: Request) {
  const auth = getAuth();
  const authHeader = request.headers.get("authorization") ?? request.headers.get("Authorization");

  if (!authHeader) {
    throw new Error("Token de autenticação ausente ou inválido");
  }

  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch) {
    throw new Error("Token de autenticação ausente ou inválido");
  }

  const token = tokenMatch[1].trim();

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Token de autenticação inválido";
    throw new Error(`Token de autenticação inválido: ${message}`);
  }
}

export async function getUserFromToken(request: Request) {
  const decodedToken = await verifyToken(request);
  const auth = getAuth();
  const userRecord = await auth.getUser(decodedToken.uid);
  return userRecord;
}