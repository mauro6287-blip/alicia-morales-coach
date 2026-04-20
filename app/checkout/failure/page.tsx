import Link from "next/link";

export const dynamic = "force-dynamic";

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20 pt-32">
      <div className="mx-auto max-w-xl px-4 md:px-6">
        <div className="rounded-2xl border border-red-900/40 bg-[#18181B] p-8 md:p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-white">
            El pago no se completó
          </h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-[#A1A1AA]">
            Tu compra no pudo ser procesada. Puede haber sido rechazada por tu
            banco o cancelada durante el proceso. No se realizó ningún cobro.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="rounded-full bg-[#FFDE59] px-6 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#F7B52A]"
            >
              Reintentar
            </Link>
            <Link
              href="/tienda"
              className="rounded-full border border-[#3F3F46] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#FFDE59] hover:text-[#FFDE59]"
            >
              Volver a la tienda
            </Link>
          </div>

          <p className="mt-6 text-xs text-[#A1A1AA]">
            ¿Problemas? Escríbenos a{" "}
            <a href="mailto:coaching@aliciamorales.cl" className="text-[#FFDE59]">
              coaching@aliciamorales.cl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
