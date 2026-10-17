import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { money, pricing, useShop } from "@/store/shop";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const cart = useShop((s) => s.cart);
  const coupon = useShop((s) => s.coupon);
  const user = useShop((s) => s.user);
  const place = useShop((s) => s.placeOrder);
  const navigate = useNavigate();
  const priced = pricing(cart, coupon);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    line1: "",
    city: "",
    region: "",
    zip: "",
    card: "",
    exp: "",
    cvc: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (priced.lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="mt-4 inline-block text-[#2f6bff]">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\d{2}\/\d{2}$/.test(form.exp)) {
            toast("Expiry should look like 08/28.");
            return;
          }
          if (!/^\d{3,4}$/.test(form.cvc)) {
            toast("CVC should be 3 or 4 digits.");
            return;
          }
          const res = place(form);
          toast(res.message);
          if (res.ok && res.id) void navigate({ to: "/order/$id", params: { id: res.id } });
        }}
      >
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="text-sm text-black/55">Demo payment. Nothing is charged and the full card number is not stored.</p>
        <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} autoComplete="name" />
        <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} autoComplete="email" />
        <Field label="Address" value={form.line1} onChange={(v) => set("line1", v)} autoComplete="address-line1" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
          <Field label="Region" value={form.region} onChange={(v) => set("region", v)} />
          <Field label="Postal code" value={form.zip} onChange={(v) => set("zip", v)} />
        </div>
        <Field
          label="Card number"
          value={form.card}
          onChange={(v) => set("card", v)}
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          autoComplete="cc-number"
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" value={form.exp} onChange={(v) => set("exp", v)} placeholder="MM/YY" autoComplete="cc-exp" />
          <Field label="CVC" value={form.cvc} onChange={(v) => set("cvc", v)} placeholder="123" autoComplete="cc-csc" />
        </div>
        <button className="w-full rounded-full bg-[#12141c] py-3 text-sm font-semibold text-white">
          Place order · {money(priced.total)}
        </button>
      </form>
      <aside className="h-fit rounded-3xl bg-white p-5">
        <h2 className="font-semibold">In this order</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {priced.lines.map(({ product, qty }) => (
            <li key={product.id} className="flex justify-between gap-3">
              <span>
                {product.name} × {qty}
              </span>
              <span>{money(product.price * qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-black/10 pt-3 text-sm">
          <p className="flex justify-between"><span>Discount</span><span>{money(priced.discount)}</span></p>
          <p className="flex justify-between"><span>Shipping</span><span>{priced.shipping ? money(priced.shipping) : "Free"}</span></p>
          <p className="flex justify-between"><span>Tax</span><span>{money(priced.tax)}</span></p>
          <p className="flex justify-between pt-1 text-base font-semibold"><span>Total</span><span>{money(priced.total)}</span></p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:border-[#2f6bff]"
      />
    </label>
  );
}
