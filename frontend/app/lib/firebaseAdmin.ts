import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth as getAdminAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

function getServiceAccountConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Configuração do Firebase Admin incompleta. Verifique NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL e NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.",
    );
  }

  return { projectId, clientEmail, privateKey };
}

function getAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0] ?? null;

    if (!adminApp) {
      throw new Error("Firebase Admin não pôde ser inicializado.");
    }

    return adminApp;
  }

  adminApp = initializeApp({
    credential: cert(getServiceAccountConfig()),
  });

  return adminApp;
}

export function getDb() {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }

  return adminDb;
}

export function getAuth() {
  if (!adminAuth) {
    adminAuth = getAdminAuth(getAdminApp());
  }

  return adminAuth;
}