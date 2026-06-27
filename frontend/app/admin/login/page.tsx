"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth, firebaseClientConfigError } from "@/app/lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
      if (user) {
        router.replace("/admin");
      }
    });

    return unsubscribe;
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!clientAuth) {
      setError(firebaseClientConfigError ?? "Firebase Auth não foi inicializado.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(clientAuth, email, password);
      router.replace("/admin");
    } catch (err) {
      setError("Falha ao fazer login. Verifique seu e-mail e senha.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-white/50">Área restrita</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Login</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">Acesse a área administrativa com sua conta Firebase.</p>
        {firebaseClientConfigError && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            {firebaseClientConfigError}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-white/75">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-white/75">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              autoComplete="current-password"
              required
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error && <p className="text-sm text-red-300">{error}</p>}
        </form>
      </div>
    </div>
  );
}

