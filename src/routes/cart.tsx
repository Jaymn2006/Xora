import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ProductArt } from "@/components/product-art";
import { money, pricing, useShop } from "@/store/shop";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = useShop((s) => s.cart);
  const coupon = useShop((s) => s.coupon);
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.remove);
  const apply = useShop((s) => s.applyCoupon);
  const clearCoupon = useShop((s) => s.clearCoupon);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const priced = pricing(cart, coupon);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Your bag</h1>
      {priced.lines.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center">
          <p className="text-lg font-semibold">The bag is empty.</p>
          <p className="mt-1 text-sm text-black/55">Add a phone, a camera, or something for the desk.</p>
          <Link
            to="/shop"
            search={{ q: "", cat: "All", sort: "featured" }}
            className="mt-5 inline-flex rounded-full bg-[#12141c] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-3">
            {priced.lines.map(({ product, qty }) => (
              <li key={product.id} className="flex gap-3 rounded-2xl bg-white p-3">
                <Link to="/product/$id" params={{ id: product.id }} className="w-28 shrink-0">
                  <ProductArt product={product} className="aspect-square rounded-xl" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-xs text-black/45 uppercase">{product.brand}</p>
                      <Link to="/product/$id" params={{ id: product.id }} className="font-semibold">
                        {product.name}
                      </Link>
                    </div>
                    <p className="font-semibold">{money(product.price * qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-black/10">
                      <button className="px-3 py-1" onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease">−</button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button className="px-3 py-1" onClick={() => setQty(product.id, qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <button
                      className="text-sm text-black/50 hover:text-red-600"
                      onClick={() => {
                        remove(product.id);
                        toast("Removed from bag.");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-3xl bg-white p-5">
            <h2 className="font-semibold">Summary</h2>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const res = apply(code);
                toast(res.message);
                if (res.ok) setCode("");
              }}
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="XOR10, SUMMER20, VIP70"
                className="w-full rounded-full border border-black/10 px-3 py-2 text-sm outline-none"
              />
              <button className="rounded-full bg-[#12141c] px-4 text-sm font-semibold text-white">Apply</button>
            </form>
            {coupon && (
              <p className="mt-2 text-sm text-[#2f6bff]">
                {coupon} applied.{" "}
                <button type="button" className="underline" onClick={clearCoupon}>
                  Remove
                </button>
              </p>
            )}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-black/70"><dt>Subtotal</dt><dd>{money(priced.subtotal)}</dd></div>
              <div className="flex justify-between text-black/70"><dt>Discount</dt><dd>{priced.discount ? `−${money(priced.discount)}` : "$0.00"}</dd></div>
              <div className="flex justify-between text-black/70"><dt>Shipping</dt><dd>{priced.shipping === 0 ? "Free" : money(priced.shipping)}</dd></div>
              <div className="flex justify-between text-black/70"><dt>Tax (8%)</dt><dd>{money(priced.tax)}</dd></div>
              <div className="flex justify-between border-t border-black/10 pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{money(priced.total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-black/45">Free shipping at $200, or with FREESHIP.</p>
            <button
              className="mt-4 w-full rounded-full bg-[#2f6bff] py-3 text-sm font-semibold text-white"
              onClick={() => void navigate({ to: "/checkout" })}
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
