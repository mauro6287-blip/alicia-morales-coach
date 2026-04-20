"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/cart";

type Product = {
  id: string;
  slug: string;
  title: string;
  priceClp: number;
  imageUrl?: string | null;
  durationMin: number;
};

export default function AddToCartButton({
  product,
  variant = "primary",
  openDrawerOnAdd = false,
}: {
  product: Product;
  variant?: "primary" | "outline";
  openDrawerOnAdd?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      priceClp: product.priceClp,
      imageUrl: product.imageUrl ?? null,
      durationMin: product.durationMin,
    });
    setAdded(true);
    if (openDrawerOnAdd) openDrawer();
    setTimeout(() => setAdded(false), 1800);
  };

  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors";
  const primary = "bg-[#FFDE59] text-gray-900 hover:bg-[#F7B52A]";
  const outline =
    "border border-[#FFDE59]/50 text-[#FFDE59] hover:bg-[#FFDE59] hover:text-gray-900";

  return (
    <button
      onClick={handleAdd}
      className={`${base} ${variant === "primary" ? primary : outline}`}
    >
      {added ? "Agregado ✓" : "Agregar al carrito"}
    </button>
  );
}
