import ProductCard from "./ProductCard";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceClp: number;
  durationMin: number;
  imageUrl: string | null;
};

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-[#A1A1AA]">
        Pronto encontrarás aquí nuestras sesiones disponibles.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
