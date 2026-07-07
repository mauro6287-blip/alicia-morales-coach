import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ofuscarRut } from "@/lib/cert/rut";
import TablaCertificados from "../componentes/TablaCertificados";

export const metadata: Metadata = {
  title: "Detalle de emisión",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EmisionDetallePage({ params }: { params: { id: string } }) {
  const emision = await prisma.emision.findUnique({
    where: { id: params.id },
    include: {
      curso: true,
      adminUser: true,
      certificados: { orderBy: { alumnoNombre: "asc" } },
    },
  });

  if (!emision) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-primary">
              Emisión del {emision.creadaEn.toLocaleDateString("es-CL")}
            </h1>
            <p className="font-sans text-sm text-muted">
              {emision.curso.nombre} · {emision.certificados.length} certificados
            </p>
          </div>
          <a
            href={`/api/admin/certificados/emision/${emision.id}/zip`}
            className="rounded bg-primary px-4 py-2 font-sans text-sm font-semibold text-background hover:bg-primary-dark"
          >
            Descargar todos (ZIP)
          </a>
        </div>

        <TablaCertificados
          certificados={emision.certificados.map((c) => ({
            id: c.id,
            codigo: c.codigo,
            alumnoNombre: c.alumnoNombre,
            alumnoRutOfuscado: ofuscarRut(c.alumnoRut),
            estado: c.estado,
            emailEnviadoEn: c.emailEnviadoEn ? c.emailEnviadoEn.toISOString() : null,
          }))}
        />
      </div>
    </div>
  );
}
