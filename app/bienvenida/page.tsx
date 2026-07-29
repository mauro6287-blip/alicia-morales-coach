import Link from "next/link";

export const dynamic = "force-dynamic";

export default function BienvenidaPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="rounded-2xl border border-[#FFDE59]/30 bg-[#18181B] p-8 md:p-10">
          <h1 className="text-center font-[family-name:var(--font-montserrat)] text-3xl font-bold text-white">
            Bienvenida
          </h1>
          <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-[#A1A1AA]">
            Este contenido se terminará de diseñar próximamente.
          </p>

          {orderId && (
            <div className="mt-6 text-center text-xs text-[#A1A1AA]">
              <span>Número de orden </span>
              <span className="font-mono text-white">{orderId}</span>
            </div>
          )}

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
