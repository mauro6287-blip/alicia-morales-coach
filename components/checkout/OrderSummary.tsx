"use client";

import { useEffect, useState } from "react";
import { selectTotalClp, useCart } from "@/lib/store/cart";
import { formatClp } from "@/lib/formatters";

export default function OrderSummary() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const total = useCart(selectTotalClp);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <aside className="sticky top-28 rounded-2xl border border-[#3F3F46] bg-[#18181B] p-6">
      <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-white">
        Resumen de tu orden
      </h2>

      <ul className="mt-4 divide-y divide-[#3F3F46]">
        {items.map((item) => (
          <li key={item.productId} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-[#A1A1AA]">
                  {item.durationMin ? `${item.durationMin} min · ` : ""}
                  {item.quantity} × {formatClp(item.priceClp)}
                </p>
              </div>
              <span className="text-sm font-semibold text-white">
                {formatClp(item.priceClp * item.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-[#3F3F46] pt-4">
        <span className="text-sm text-[#A1A1AA]">Total</span>
        <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#FFDE59]">
          {formatClp(total)}
        </span>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#A1A1AA]">
        Recibirás un email de confirmación. Alicia coordinará contigo el
        agendamiento de tu(s) sesión(es) dentro de 24 horas.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#27272A] px-3 py-2 text-xs text-[#A1A1AA]">
        <svg className="h-4 w-4 text-[#FFDE59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Pago procesado de forma segura por Mercado Pago
      </div>
    </aside>
  );
}
