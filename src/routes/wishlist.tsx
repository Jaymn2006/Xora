import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct } from "@/data/catalog";
import { ProductCard } from "@/components/product-card";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const ids = useShop((s) => s.wishlist);
  const items = ids.map(getProduct).filter((p) => !!p);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Wishlist</h1>
      <p className="mt-1 text-sm text-black/55">{items.length} saved.</p>
      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center">
          <p className="font-semibold">Nothing saved yet.</p>
          <Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="mt-3 inline-block text-sm font-semibold text-[#2f6bff]">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
