"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BotonAnular from "./BotonAnular";

export type CertificadoFila = {
  id: string;
  codigo: string;
  alumnoNombre: string;
  alumnoRutOfuscado: string;
  estado: "VALIDO" | "ANULADO";
  emailEnviadoEn: string | null;
};

type Fallido = { id: string; nombre: string; error: string };
type Resumen = { enviados: number; omitidos: number; fallidos: Fallido[] };

// Tope que acepta el endpoint de lote en una sola petición.
const MAX_TAMANO_LOTE = 50;
const TAMANO_LOTE_POR_DEFECTO = 25;

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
  // Override optimista del envío individual. Mientras no se use este botón
  // mandan las props, así el badge se actualiza cuando el envío por lote
  // provoca un router.refresh() (el estado local sobreviviría a la
  // reconciliación y dejaría el badge desactualizado).
  const [enviadoLocal, setEnviadoLocal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailEnviadoEn = enviadoLocal ?? certificado.emailEnviadoEn;

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
      setEnviadoLocal(data.emailEnviadoEn);
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

function ResumenLote({ resumen }: { resumen: Resumen }) {
  return (
    <div className="mt-3 rounded border border-border bg-background p-3">
      <p className="font-sans text-sm text-foreground">
        <span className="text-green-400">{resumen.enviados} enviados</span>
        {" · "}
        <span className="text-muted">{resumen.omitidos} omitidos</span>
        {" · "}
        <span className={resumen.fallidos.length > 0 ? "text-red-400" : "text-muted"}>
          {resumen.fallidos.length} fallidos
        </span>
      </p>
      {resumen.fallidos.length > 0 && (
        <ul className="mt-2 space-y-1">
          {resumen.fallidos.map((f) => (
            <li key={f.id} className="font-sans text-xs text-red-400">
              {f.nombre}: {f.error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TablaCertificados({ certificados }: { certificados: CertificadoFila[] }) {
  const router = useRouter();
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [tamanoLote, setTamanoLote] = useState(TAMANO_LOTE_POR_DEFECTO);
  const [reenviar, setReenviar] = useState(false);
  const [enviandoLote, setEnviandoLote] = useState(false);
  const [progreso, setProgreso] = useState<string | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [errorLote, setErrorLote] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Los anulados no se pueden enviar: quedan fuera de la selección.
  const seleccionables = useMemo(
    () => certificados.filter((c) => c.estado === "VALIDO"),
    [certificados],
  );

  const todosSeleccionados =
    seleccionables.length > 0 && seleccionados.size === seleccionables.length;

  function alternarUno(id: string) {
    setAviso(null);
    setSeleccionados((previos) => {
      const siguiente = new Set(previos);
      if (siguiente.has(id)) {
        siguiente.delete(id);
      } else {
        siguiente.add(id);
      }
      return siguiente;
    });
  }

  function alternarTodos() {
    setAviso(null);
    setSeleccionados(
      todosSeleccionados ? new Set() : new Set(seleccionables.map((c) => c.id)),
    );
  }

  async function enviarSeleccionados() {
    const ids = seleccionables.filter((c) => seleccionados.has(c.id)).map((c) => c.id);
    if (ids.length === 0) {
      // El botón queda habilitado sin selección a propósito: uno deshabilitado
      // no explica nada y la columna de casillas es fácil de pasar por alto.
      setAviso("Selecciona al menos un certificado marcando su casilla en la tabla.");
      return;
    }
    setAviso(null);

    // El input está acotado a 1–50, pero el usuario puede escribir cualquier
    // cosa a mano: se sanea antes de trocear para no pasarse del tope del
    // endpoint ni caer en un tamaño 0 que haría un bucle infinito.
    const tamano = Math.min(Math.max(Math.trunc(tamanoLote) || 1, 1), MAX_TAMANO_LOTE);

    setEnviandoLote(true);
    setResumen(null);
    setErrorLote(null);

    const acumulado: Resumen = { enviados: 0, omitidos: 0, fallidos: [] };

    try {
      // Un grupo por petición, en serie: el siguiente no arranca hasta que el
      // anterior responde, para no saltarse el límite de tasa de Resend.
      for (let inicio = 0; inicio < ids.length; inicio += tamano) {
        const grupo = ids.slice(inicio, inicio + tamano);
        const fin = inicio + grupo.length;
        setProgreso(`Enviando ${inicio + 1}–${fin} de ${ids.length}...`);

        const res = await fetch("/api/admin/certificados/enviar-lote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: grupo, reenviar }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setErrorLote(data.error || "No se pudo completar el envío");
          break;
        }

        acumulado.enviados += data.enviados ?? 0;
        acumulado.omitidos += data.omitidos ?? 0;
        acumulado.fallidos.push(...(data.fallidos ?? []));
      }
    } catch {
      setErrorLote("No se pudo conectar con el servidor");
    } finally {
      setEnviandoLote(false);
      setProgreso(null);
      setResumen(acumulado);
      setSeleccionados(new Set());
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 font-sans text-sm text-foreground">
            Tamaño de lote
            <input
              type="number"
              min={1}
              max={MAX_TAMANO_LOTE}
              value={tamanoLote}
              onChange={(e) => setTamanoLote(Number(e.target.value))}
              disabled={enviandoLote}
              className="w-20 rounded border border-border bg-background px-2 py-1 font-sans text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
            />
          </label>

          <label className="flex items-center gap-2 font-sans text-sm text-foreground">
            <input
              type="checkbox"
              checked={reenviar}
              onChange={(e) => setReenviar(e.target.checked)}
              disabled={enviandoLote}
              className="h-4 w-4 accent-primary"
            />
            Reenviar a quienes ya recibieron
          </label>

          <button
            type="button"
            onClick={enviarSeleccionados}
            disabled={enviandoLote}
            className="rounded bg-primary px-4 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark disabled:opacity-40"
          >
            {enviandoLote ? "Enviando..." : `Enviar seleccionados (${seleccionados.size})`}
          </button>

          {progreso && <span className="font-sans text-sm text-muted">{progreso}</span>}
        </div>

        {aviso && <p className="mt-3 font-sans text-sm text-primary">{aviso}</p>}
        {errorLote && <p className="mt-3 font-sans text-sm text-red-400">{errorLote}</p>}
        {resumen && <ResumenLote resumen={resumen} />}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={todosSeleccionados}
                  onChange={alternarTodos}
                  disabled={enviandoLote || seleccionables.length === 0}
                  aria-label="Seleccionar todos"
                  className="h-4 w-4 accent-primary"
                />
              </th>
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
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.has(c.id)}
                    onChange={() => alternarUno(c.id)}
                    disabled={enviandoLote || c.estado === "ANULADO"}
                    aria-label={`Seleccionar ${c.alumnoNombre}`}
                    className="h-4 w-4 accent-primary disabled:opacity-30"
                  />
                </td>
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
    </div>
  );
}
