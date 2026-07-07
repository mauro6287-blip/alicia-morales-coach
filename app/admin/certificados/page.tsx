import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CertificadosClient from "./CertificadosClient";

export const metadata: Metadata = {
  title: "Emitir certificados",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CertificadosPage() {
  const [cursos, plantillas] = await Promise.all([
    prisma.curso.findMany({ orderBy: { creadoEn: "desc" } }),
    prisma.plantillaCertificado.findMany({ where: { activa: true } }),
  ]);

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 font-display text-2xl font-semibold text-primary">
          Emitir certificados
        </h1>
        <CertificadosClient
          cursos={cursos.map((c) => ({ id: c.id, nombre: c.nombre }))}
          plantillas={plantillas.map((p) => ({ id: p.id, nombre: p.nombre }))}
        />
      </div>
    </div>
  );
}
