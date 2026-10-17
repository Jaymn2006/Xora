import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

const team = [
  { name: "Amina Cole", role: "Buyer, phones & tablets" },
  { name: "Leo Park", role: "Cameras" },
  { name: "Nia Okonkwo", role: "Desk & displays" },
  { name: "Jonah Ellis", role: "Care & returns" },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#2f6bff] uppercase">About</p>
      <h1 className="mt-2 text-4xl font-semibold">Who we are</h1>
      <p className="mt-4 text-base leading-relaxed text-black/70">
        Xora started as a small counter that refurbished phones and refused to sell anything the staff would not carry themselves.
        The catalog is still edited that way: fewer SKUs, prices you can compare, and coupons that actually change the total.
      </p>
      <p className="mt-3 text-base leading-relaxed text-black/70">
        This shop runs entirely in your browser. Accounts, the bag, the wishlist, and order receipts stay on this device so you can
        try the full path — search, save, coupon, checkout — without handing a card to a server.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {team.map((m) => (
          <div key={m.name} className="rounded-2xl bg-white p-4">
            <div className="grid size-10 place-items-center rounded-full bg-[#12141c] text-sm font-semibold text-white">
              {m.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <p className="mt-3 font-semibold">{m.name}</p>
            <p className="text-sm text-black/55">{m.role}</p>
          </div>
        ))}
      </div>
      <Link to="/contact" className="mt-8 inline-flex rounded-full bg-[#12141c] px-4 py-2 text-sm font-semibold text-white">
        Talk to the desk
      </Link>
    </div>
  );
}
