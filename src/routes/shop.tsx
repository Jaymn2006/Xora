import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, products, type Category } from "@/data/catalog";
import { ProductCard } from "@/components/product-card";

type Search = { q: string; cat: string; sort: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : "",
    cat: typeof search.cat === "string" ? search.cat : "All",
    sort: typeof search.sort === "string" ? search.sort : "featured",
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q, cat, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  let list = products.filter((p) => {
    const query = q.trim().toLowerCase();
    const matchesQ =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    const matchesC = cat === "All" || p.category === cat;
    return matchesQ && matchesC;
  });

  list = [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "name") return a.name.localeCompare(b.name);
    return Number(!!b.featured) - Number(!!a.featured);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#2f6bff] uppercase">Catalog</p>
      <h1 className="mt-1 text-3xl font-semibold">Shop</h1>
      <p className="mt-1 text-sm text-black/55">{list.length} products{q ? ` for “${q}”` : ""}.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => void navigate({ search: { q, cat: c, sort } })}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
                cat === c ? "bg-[#12141c] text-white" : "bg-white text-black/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="sm:ml-auto text-sm">
          <span className="sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => void navigate({ search: { q, cat, sort: e.target.value } })}
            className="rounded-full border border-black/10 bg-white px-3 py-2"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 text-center">
          <p className="font-semibold">Nothing matches that filter.</p>
          <button
            className="mt-3 text-sm font-semibold text-[#2f6bff]"
            onClick={() => void navigate({ search: { q: "", cat: "All", sort: "featured" } })}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <p className="sr-only">{cat as Category}</p>
    </div>
  );
}
