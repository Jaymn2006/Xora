import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, products } from "@/data/catalog";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { money, useShop } from "@/store/shop";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  const add = useShop((s) => s.add);
  const wish = useShop((s) => s.wishlist.includes(id));
  const toggle = useShop((s) => s.toggleWish);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="mt-4 inline-block text-[#2f6bff]">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm text-black/50">
        <Link to="/shop" search={{ q: "", cat: product.category, sort: "featured" }} className="hover:text-[#2f6bff]">
          {product.category}
        </Link>
      </p>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductArt product={product} className="aspect-square rounded-[28px]" />
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-sm text-black/55">
            {product.rating.toFixed(1)} / 5 · {product.reviews} reviews · {product.stock} in stock
          </p>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-semibold">{money(product.price)}</p>
            {product.compare && <p className="text-black/40 line-through">{money(product.compare)}</p>}
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70">{product.blurb}</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {product.specs.map((s) => (
              <li key={s} className="rounded-xl bg-white px-3 py-2">{s}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-black/10 bg-white">
              <button className="px-3 py-2" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease">−</button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                className="px-3 py-2"
                onClick={() => setQty((n) => Math.min(product.stock, n + 1))}
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <button
              className="rounded-full bg-[#12141c] px-5 py-2.5 text-sm font-semibold text-white"
              onClick={() => toast(add(product.id, qty).message)}
            >
              Add to bag
            </button>
            <button
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold"
              onClick={() => toast(toggle(product.id) ? "Saved to wishlist." : "Removed from wishlist.")}
            >
              {wish ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-semibold">More in {product.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
