import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { money, useShop } from "@/store/shop";
import { ProductArt } from "@/components/product-art";

export function ProductCard({ product }: { product: Product }) {
  const add = useShop((s) => s.add);
  const wish = useShop((s) => s.wishlist.includes(product.id));
  const toggle = useShop((s) => s.toggleWish);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_10px_30px_-24px_rgba(18,20,28,0.8)]">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <ProductArt product={product} className="aspect-[5/4]" />
      </Link>
      <button
        aria-label={wish ? "Remove from wishlist" : "Save to wishlist"}
        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm"
        onClick={() => {
          const on = toggle(product.id);
          toast(on ? `${product.name} saved.` : "Removed from wishlist.");
        }}
      >
        <Heart className={`size-4 ${wish ? "fill-[#2f6bff] text-[#2f6bff]" : ""}`} />
      </button>
      {product.badge && (
        <span className="absolute top-3 left-3 rounded-full bg-[#12141c] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
          {product.badge}
        </span>
      )}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-black/45 uppercase">{product.brand}</p>
        <Link to="/product/$id" params={{ id: product.id }} className="font-semibold leading-snug hover:text-[#2f6bff]">
          {product.name}
        </Link>
        <p className="flex items-center gap-1 text-xs text-black/55">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)} · {product.reviews}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-lg font-semibold">{money(product.price)}</p>
            {product.compare && (
              <p className="text-xs text-black/40 line-through">{money(product.compare)}</p>
            )}
          </div>
          <button
            className="grid size-10 place-items-center rounded-full bg-[#12141c] text-white hover:bg-[#2f6bff]"
            aria-label={`Add ${product.name} to bag`}
            onClick={() => {
              const res = add(product.id);
              toast(res.message);
            }}
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
