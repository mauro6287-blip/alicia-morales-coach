import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatClp } from "@/lib/formatters";
import AddToCartButton from "@/components/tienda/AddToCartButton";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product || !product.active) notFound();

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <nav className="mb-6 text-sm text-[#A1A1AA]">
          <Link href="/" className="hover:text-[#FFDE59]">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tienda" className="hover:text-[#FFDE59]">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#27272A]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#27272A] to-[#18181B]">
                <svg className="h-32 w-32 text-[#FFDE59]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="mb-3 inline-block w-fit rounded-full bg-[#FFDE59]/10 px-3 py-1 text-xs font-medium text-[#FFDE59]">
              {product.durationMin} minutos
            </span>

            <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-white md:text-4xl">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-[#FFDE59]">
                {formatClp(product.priceClp)}
              </span>
              <span className="text-sm text-[#A1A1AA]">CLP</span>
            </div>

            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-[#D4D4D8]">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} openDrawerOnAdd />
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center rounded-full border border-[#3F3F46] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#FFDE59] hover:text-[#FFDE59]"
              >
                Ver otras sesiones
              </Link>
            </div>

            <div className="mt-10 rounded-xl border border-[#3F3F46] bg-[#18181B] p-5">
              <h3 className="mb-2 text-sm font-semibold text-white">
                ¿Cómo funciona?
              </h3>
              <ul className="space-y-1.5 text-sm text-[#A1A1AA]">
                <li>• Pagás online de forma segura con Mercado Pago.</li>
                <li>• Recibís un email de confirmación inmediato.</li>
                <li>
                  • Alicia te contacta en &lt;24h para coordinar la agenda.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
