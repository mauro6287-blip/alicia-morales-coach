import Image from "next/image";
import Link from "next/link";
import { formatClp } from "@/lib/formatters";
import AddToCartButton from "./AddToCartButton";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceClp: number;
  durationMin: number;
  imageUrl: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#18181B] transition-all hover:border-[#FFDE59]/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#27272A]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#27272A] to-[#18181B]">
            <svg className="h-20 w-20 text-[#FFDE59]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {product.durationMin} min
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-white">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#A1A1AA]">
          {product.description}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[#FFDE59]">
            {formatClp(product.priceClp)}
          </span>
          <span className="text-xs text-[#A1A1AA]">CLP</span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/tienda/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[#3F3F46] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#FFDE59] hover:text-[#FFDE59]"
          >
            Ver detalle
          </Link>
          <AddToCartButton product={product} openDrawerOnAdd />
        </div>
      </div>
    </article>
  );
}
