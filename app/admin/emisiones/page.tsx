import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BuscadorCertificados from "./componentes/BuscadorCertificados";

export const metadata: Metadata = {
  title: "Emisiones",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const POR_PAGINA = 20;

export default async function EmisionesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number.parseInt(searchParams.page || "1", 10) || 1);

  const [emisiones, total] = await Promise.all([
    prisma.emision.findMany({
      include: {
        curso: true,
        adminUser: true,
        _count: { select: { certificados: true } },
      },
      orderBy: { creadaEn: "desc" },
      skip: (page - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.emision.count(),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 font-display text-2xl font-semibold text-primary">Emisiones</h1>

        <BuscadorCertificados />

        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Curso</th>
                <th className="px-4 py-3">Emitidos</th>
                <th className="px-4 py-3">Emitida por</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {emisiones.map((e) => (
                <tr key={e.id} className="border-b border-border/50">
                  <td className="px-4 py-3 text-foreground">
                    {e.creadaEn.toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-4 py-3 text-foreground">{e.curso.nombre}</td>
                  <td className="px-4 py-3 text-foreground">{e._count.certificados}</td>
                  <td className="px-4 py-3 text-foreground">{e.adminUser.nombre}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/emisiones/${e.id}`}
                      className="rounded border border-border px-3 py-1 font-sans text-xs text-foreground hover:bg-background"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
              {emisiones.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    Aún no hay emisiones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/emisiones?page=${p}`}
                className={`rounded px-3 py-1 font-sans text-sm ${
                  p === page
                    ? "bg-primary text-background"
                    : "border border-border text-foreground hover:bg-surface"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
