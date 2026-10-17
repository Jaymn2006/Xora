import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useShop } from "@/store/shop";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const count = useShop((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const wishes = useShop((s) => s.wishlist.length);
  const user = useShop((s) => s.user);
  const subscribe = useShop((s) => s.subscribe);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [email, setEmail] = useState("");

  function search(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    void navigate({ to: "/shop", search: { q: q.trim(), cat: "All", sort: "featured" } });
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#12141c]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f6f5f2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <button
            className="rounded-md p-2 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/brand/logo.png" alt="Xora" className="h-8 w-auto" />
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  path === l.to ? "bg-[#12141c] text-white" : "text-[#12141c]/80 hover:bg-black/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={search} className="ml-auto hidden min-w-0 flex-1 max-w-xs items-center md:flex">
            <label className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5">
              <Search className="size-4 text-black/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the shop"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Link to="/wishlist" className="relative rounded-full p-2 hover:bg-black/5" aria-label="Wishlist">
              <Heart className="size-5" />
              {wishes > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-[#2f6bff] text-[10px] font-semibold text-white">
                  {wishes}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 hover:bg-black/5" aria-label="Bag">
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-[#2f6bff] text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              className="hidden items-center gap-1 rounded-full px-2 py-1.5 text-sm font-medium hover:bg-black/5 sm:flex"
            >
              <UserRound className="size-4" />
              {user ? user.name.split(" ")[0] : "Login"}
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="h-full w-[min(100%,320px)] bg-[#f6f5f2] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <img src="/brand/logo.png" alt="" className="h-8" />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-md p-2">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={search} className="mb-4">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              />
            </form>
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium hover:bg-black/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/account" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium">
                {user ? "Account" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <main>{children}</main>

      <footer className="mt-16 border-t border-black/10 bg-[#12141c] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/brand/logo.png" alt="Xora" className="h-8 brightness-0 invert" />
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Devices, cameras, and desk gear picked for people who actually use them. Orders stay on this device.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white/50">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="hover:text-[#9db7ff]">All products</Link></li>
              <li><Link to="/cart" className="hover:text-[#9db7ff]">Bag</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#9db7ff]">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white/50">Help</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/account" className="hover:text-[#9db7ff]">Account & orders</Link></li>
              <li><Link to="/contact" className="hover:text-[#9db7ff]">Contact</Link></li>
              <li><Link to="/about" className="hover:text-[#9db7ff]">About Xora</Link></li>
            </ul>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = subscribe(email);
              toast(res.message);
              if (res.ok) setEmail("");
            }}
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white/50">Notes</h3>
            <p className="mt-3 text-sm text-white/70">New drops and the XOR10 welcome code.</p>
            <div className="mt-3 flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-full bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <button className="rounded-full bg-[#2f6bff] px-4 text-sm font-semibold">Join</button>
            </div>
          </form>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Xora. Demo checkout — cards are not charged.
        </div>
      </footer>
      <Toaster theme="light" position="top-center" />
    </div>
  );
}
