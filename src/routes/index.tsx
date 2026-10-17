import { createFileRoute, Link } from "@tanstack/react-router";
import { Headset, Package, ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";
import { products } from "@/data/catalog";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({ component: Home });

const features = [
  { icon: Truck, title: "Free over $200", text: "Or use FREESHIP at checkout." },
  { icon: Package, title: "Tracked bag", text: "Quantities and stock stay in sync." },
  { icon: Wallet, title: "Real coupons", text: "XOR10, SUMMER20, and VIP70." },
  { icon: ShieldCheck, title: "Demo checkout", text: "Cards are validated, never charged." },
  { icon: Sparkles, title: "Wishlist", text: "Save pieces and come back later." },
  { icon: Headset, title: "Orders on device", text: "Receipts live in your account." },
];

function Home() {
  const featured = products.filter((p) => p.featured);
  const arrivals = products.filter((p) => p.arrival).slice(0, 4);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#2f6bff] uppercase">Trade-in offer</p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            Super value deals
            <span className="block text-[#2f6bff]">on all products.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-black/65">
            Save more with coupons and up to 70% off. Phones, laptops, cameras, and the desk around them.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/shop"
              search={{ q: "", cat: "All", sort: "featured" }}
              className="rounded-full bg-[#12141c] px-5 py-3 text-sm font-semibold text-white"
            >
              Shop now
            </Link>
            <Link to="/shop" search={{ q: "", cat: "All", sort: "price-asc" }} className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold">
              Sort by price
            </Link>
          </div>
          <p className="mt-4 text-sm text-black/50">
            Try code <span className="font-semibold text-[#12141c]">VIP70</span> in the bag.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[28px] bg-[#12141c] p-6 text-white shadow-[0_30px_80px_-40px_rgba(18,20,28,0.9)]">
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">This week</p>
          <p className="mt-2 text-3xl font-semibold">iPhone 15 Pro Max</p>
          <p className="mt-2 max-w-sm text-sm text-white/70">Flagship phone, priced like a midweek impulse. 256 GB, still in stock.</p>
          <p className="mt-6 text-4xl font-semibold">$115</p>
          <Link
            to="/product/$id"
            params={{ id: "5" }}
            className="mt-6 inline-flex rounded-full bg-[#2f6bff] px-4 py-2 text-sm font-semibold"
          >
            View the phone
          </Link>
          <div className="pointer-events-none absolute -right-8 -bottom-10 size-48 rounded-full bg-[#2f6bff]/40 blur-2xl" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="flex gap-3 rounded-2xl border border-black/5 bg-white p-4">
            <f.icon className="size-5 shrink-0 text-[#2f6bff]" />
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-sm text-black/55">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Featured products</h2>
            <p className="text-sm text-black/55">Summer collection, current prices.</p>
          </div>
          <Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="text-sm font-semibold text-[#2f6bff]">
            See all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1d4ed8] to-[#12141c] px-6 py-10 text-white sm:px-10">
          <p className="text-xs tracking-[0.2em] uppercase text-white/60">Repair & care</p>
          <h2 className="mt-2 max-w-xl text-3xl font-semibold">Up to 70% off the pieces already in the catalog.</h2>
          <p className="mt-2 max-w-lg text-sm text-white/75">VIP70 is a real code in this shop. Apply it on the bag before you check out.</p>
          <Link to="/cart" className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#12141c]">
            Open bag
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-semibold">New arrivals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
