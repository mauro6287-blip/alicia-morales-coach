"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { selectItemCount, useCart } from "@/lib/store/cart";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const count = useCart(selectItemCount);

  useEffect(() => setMounted(true), []);

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
          <span className="text-white">Checkout</span>
        </nav>

        <h1 className="mb-10 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-white md:text-4xl">
          Finalizá tu <span className="text-[#FFDE59]">compra</span>
        </h1>

        {mounted && count === 0 ? (
          <div className="rounded-2xl border border-[#3F3F46] bg-[#18181B] p-10 text-center">
            <p className="mb-4 text-white">Tu carrito está vacío.</p>
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center rounded-full bg-[#FFDE59] px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-[#F7B52A]"
            >
              Ver sesiones disponibles
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            <div className="rounded-2xl border border-[#3F3F46] bg-[#18181B] p-6 md:p-8">
              <h2 className="mb-6 font-[family-name:var(--font-montserrat)] text-lg font-semibold text-white">
                Datos de contacto
              </h2>
              <CheckoutForm />
            </div>
            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
