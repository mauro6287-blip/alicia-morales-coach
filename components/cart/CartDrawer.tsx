"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  selectItemCount,
  selectTotalClp,
  useCart,
} from "@/lib/store/cart";
import { formatClp } from "@/lib/formatters";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCart((s) => s.isOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const total = useCart(selectTotalClp);
  const count = useCart(selectItemCount);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeDrawer]);

  if (!mounted) return null;

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#18181B] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#3F3F46] px-6 py-4">
          <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-white">
            Tu carrito {count > 0 && <span className="text-[#FFDE59]">({count})</span>}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <svg className="mb-4 h-16 w-16 text-[#3F3F46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mb-2 text-white">Tu carrito está vacío</p>
              <p className="mb-6 text-sm text-[#A1A1AA]">Explorá las sesiones disponibles</p>
              <Link
                href="/tienda"
                onClick={closeDrawer}
                className="rounded-full bg-[#FFDE59] px-5 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-[#F7B52A]"
              >
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#3F3F46] px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#A1A1AA]">Total</span>
              <span className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-[#FFDE59]">
                {formatClp(total)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center rounded-full bg-[#FFDE59] px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#F7B52A]"
            >
              Ir a pagar
            </Link>
            <p className="mt-3 text-center text-xs text-[#A1A1AA]">
              Pago seguro procesado por Mercado Pago
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
