"use client";

import { useState } from "react";
import BotonAnular from "./BotonAnular";

export type CertificadoFila = {
  id: string;
  codigo: string;
  alumnoNombre: string;
  alumnoRutOfuscado: string;
  estado: "VALIDO" | "ANULADO";
  emailEnviadoEn: string | null;
};

function EstadoBadge({ estado }: { estado: "VALIDO" | "ANULADO" }) {
  if (estado === "VALIDO") {
    return (
      <span className="rounded bg-green-900/50 px-2 py-1 text-xs font-semibold text-green-400">
        VÁLIDO
      </span>
    );
  }
  return (
    <span className="rounded bg-red-900/50 px-2 py-1 text-xs font-semibold text-red-400">
      ANULADO
    </span>
  );
}

function EmailBadge({ emailEnviadoEn }: { emailEnviadoEn: string | null }) {
  if (!emailEnviadoEn) {
    return (
      <span className="rounded bg-surface-elevated px-2 py-1 text-xs text-muted">
        No enviado
      </span>
    );
  }
  return (
    <span className="rounded bg-green-900/50 px-2 py-1 text-xs text-green-400">
      Enviado {new Date(emailEnviadoEn).toLocaleDateString("es-CL")}
    </span>
  );
}

function FilaAcciones({ certificado }: { certificado: CertificadoFila }) {
  const [enviando, setEnviando] = useState(false);
  const [emailEnviadoEn, setEmailEnviadoEn] = useState(certificado.emailEnviadoEn);
  const [error, setError] = useState<string | null>(null);

  async function enviarEmail() {
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch(`/api/admin/certificados/${certificado.id}/email`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo enviar");
        return;
      }
      setEmailEnviadoEn(data.emailEnviadoEn);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <a
          href={`/api/admin/certificados/${certificado.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-border px-3 py-1 font-sans text-xs text-foreground hover:bg-background"
        >
          PDF
        </a>
        <button
          type="button"
          onClick={enviarEmail}
          disabled={enviando || certificado.estado === "ANULADO"}
          className="rounded border border-border px-3 py-1 font-sans text-xs text-foreground hover:bg-background disabled:opacity-40"
        >
          {enviando ? "Enviando..." : "Enviar email"}
        </button>
        {certificado.estado === "VALIDO" && <BotonAnular certificadoId={certificado.id} />}
      </div>
      <EmailBadge emailEnviadoEn={emailEnviadoEn} />
      {error && <p className="font-sans text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function TablaCertificados({ certificados }: { certificados: CertificadoFila[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-left font-sans text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">RUT</th>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {certificados.map((c) => (
            <tr key={c.id} className="border-b border-border/50">
              <td className="px-4 py-3 text-foreground">{c.alumnoNombre}</td>
              <td className="px-4 py-3 text-foreground">{c.alumnoRutOfuscado}</td>
              <td className="px-4 py-3 font-mono text-foreground">{c.codigo}</td>
              <td className="px-4 py-3">
                <EstadoBadge estado={c.estado} />
              </td>
              <td className="px-4 py-3 text-right">
                <FilaAcciones certificado={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
