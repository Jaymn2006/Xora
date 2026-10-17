import type { Product } from "@/data/catalog";

export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#eceae6] ${className}`}>
      <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
