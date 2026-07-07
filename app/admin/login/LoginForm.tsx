"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Credenciales inválidas");
        setLoading(false);
        return;
      }
      router.push("/admin/certificados");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-xl"
    >
      <h1 className="mb-1 font-display text-2xl font-semibold text-primary">
        Panel administrativo
      </h1>
      <p className="mb-6 font-sans text-sm text-muted">
        Escuela de Competencias Aplicadas
      </p>

      <label className="mb-1 block font-sans text-sm text-foreground" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
      />

      <label className="mb-1 block font-sans text-sm text-foreground" htmlFor="password">
        Contraseña
      </label>
      <input
        id="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-primary"
      />

      {error && (
        <p className="mb-4 font-sans text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-primary px-4 py-2 font-sans text-sm font-semibold text-background transition hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
