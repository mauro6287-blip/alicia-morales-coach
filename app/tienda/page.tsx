import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/tienda/ProductGrid";

export const metadata: Metadata = {
  title: "Tienda · Sesiones disponibles",
  description:
    "Agenda una sesión de coaching 1-a-1 con Alicia Morales. Método CARA aplicado a tu proceso de desarrollo personal.",
};

export const revalidate = 60;

export default async function TiendaPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <nav className="mb-6 text-sm text-[#A1A1AA]">
          <Link href="/" className="hover:text-[#FFDE59]">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Tienda</span>
        </nav>

        <header className="mb-12 max-w-2xl">
          <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-white md:text-5xl">
            Sesiones <span className="text-[#FFDE59]">disponibles</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
            Espacios 1-a-1 de coaching bajo el método CARA. Elige el formato que
            mejor se adapte a tu momento. Tras el pago coordinamos contigo el
            agendamiento por email.
          </p>
        </header>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
