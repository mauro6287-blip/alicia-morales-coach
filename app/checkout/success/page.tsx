import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatClp } from "@/lib/formatters";
import CartCleaner from "./CartCleaner";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;
  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <CartCleaner />
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="rounded-2xl border border-[#FFDE59]/30 bg-[#18181B] p-8 md:p-10">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDE59]/10">
              <svg className="h-8 w-8 text-[#FFDE59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-center font-[family-name:var(--font-montserrat)] text-3xl font-bold text-white">
            ¡Gracias por tu solicitud!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-[#A1A1AA]">
            Hemos recibido tu pago correctamente. <strong className="text-white">Alicia se contactará contigo dentro de las próximas 24 horas</strong> para coordinar el agendamiento de tu(s) sesión(es).
          </p>

          <div className="mt-8 rounded-xl border border-[#3F3F46] bg-[#1A1A1A] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Resumen de tu compra</h2>
            <ul className="divide-y divide-[#3F3F46]">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{it.titleSnapshot}</p>
                    <p className="text-xs text-[#A1A1AA]">
                      {it.product.durationMin} min · {it.quantity} × {formatClp(it.unitPriceClp)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {formatClp(it.unitPriceClp * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-[#3F3F46] pt-4">
              <span className="text-sm text-[#A1A1AA]">Total pagado</span>
              <span className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-[#FFDE59]">
                {formatClp(order.totalClp)}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#A1A1AA]">
            <span>Número de orden </span>
            <span className="font-mono text-white">{order.id}</span>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="rounded-full bg-[#FFDE59] px-6 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#F7B52A]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
