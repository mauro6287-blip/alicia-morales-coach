"use client";

import Image from "next/image";
import { type CartItem as CartItemType, useCart } from "@/lib/store/cart";
import { formatClp } from "@/lib/formatters";

export default function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className="flex gap-3 border-b border-[#3F3F46] py-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[#27272A]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#FFDE59]/40">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            {item.durationMin && (
              <p className="text-xs text-[#A1A1AA]">{item.durationMin} min</p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            aria-label="Eliminar"
            className="text-[#A1A1AA] transition-colors hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Disminuir"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3F3F46] text-white transition-colors hover:border-[#FFDE59] hover:text-[#FFDE59]"
            >
              −
            </button>
            <span className="min-w-[20px] text-center text-sm font-medium text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Aumentar"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3F3F46] text-white transition-colors hover:border-[#FFDE59] hover:text-[#FFDE59]"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-[#FFDE59]">
            {formatClp(item.priceClp * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
