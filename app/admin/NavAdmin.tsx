"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ENLACES = [
  { href: "/admin/certificados", label: "Emitir certificados" },
  { href: "/admin/emisiones", label: "Emisiones" },
];

export default function NavAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  // El login no lleva menú: todavía no hay sesión que navegar.
  if (pathname === "/admin/login") return null;

  async function cerrarSesion() {
    setSaliendo(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setSaliendo(false);
    }
  }

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-6 py-3">
        <span className="mr-3 font-display text-sm font-semibold text-primary">
          Panel de certificación
        </span>

        {ENLACES.map((enlace) => {
          // La ficha de una emisión (/admin/emisiones/<id>) mantiene activo
          // el enlace de Emisiones.
          const activo =
            pathname === enlace.href || pathname.startsWith(`${enlace.href}/`);
          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              aria-current={activo ? "page" : undefined}
              className={`rounded px-3 py-1.5 font-sans text-sm transition-colors ${
                activo
                  ? "bg-primary font-semibold text-background"
                  : "text-foreground hover:bg-background"
              }`}
            >
              {enlace.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={cerrarSesion}
          disabled={saliendo}
          className="ml-auto rounded border border-border px-3 py-1.5 font-sans text-sm text-muted transition-colors hover:text-foreground disabled:opacity-40"
        >
          {saliendo ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </nav>
  );
}
