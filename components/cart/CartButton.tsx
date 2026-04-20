"use client";

import { useEffect, useState } from "react";
import { selectItemCount, useCart } from "@/lib/store/cart";

export default function CartButton({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const count = useCart(selectItemCount);
  const openDrawer = useCart((s) => s.openDrawer);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={openDrawer}
      aria-label="Abrir carrito"
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-[#FFDE59]/30 text-white transition-colors hover:bg-[#27272A] hover:text-[#FFDE59] ${className}`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {mounted && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FFDE59] px-1 text-[11px] font-bold text-gray-900">
          {count}
        </span>
      )}
    </button>
  );
}
