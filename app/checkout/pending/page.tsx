import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <div className="mx-auto max-w-xl px-4 md:px-6">
        <div className="rounded-2xl border border-[#FFDE59]/30 bg-[#18181B] p-8 md:p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDE59]/10">
              <svg className="h-8 w-8 text-[#FFDE59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-white">
            Tu pago está en proceso
          </h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#A1A1AA]">
            Estamos confirmando tu pago con Mercado Pago. Te notificaremos por
            email en cuanto se acredite. Normalmente toma unos minutos.
          </p>

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
