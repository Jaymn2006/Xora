import { createFileRoute, Link } from "@tanstack/react-router";
import { money, useShop } from "@/store/shop";

export const Route = createFileRoute("/order/$id")({ component: OrderPage });

function OrderPage() {
  const { id } = Route.useParams();
  const order = useShop((s) => s.orders.find((o) => o.id === id));

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Order not on this device</h1>
        <Link to="/account" className="mt-3 inline-block text-[#2f6bff]">See your orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#2f6bff] uppercase">Confirmed</p>
      <h1 className="mt-1 text-3xl font-semibold">Thanks, {order.name.split(" ")[0]}.</h1>
      <p className="mt-2 text-sm text-black/60">
        Order <span className="font-semibold text-[#12141c]">{order.id}</span> is saved on this device. Card ending {order.last4}. No charge was made.
      </p>
      <div className="mt-6 rounded-3xl bg-white p-5">
        <p className="text-sm text-black/55">
          Ships to {order.line1}, {order.city}
          {order.region ? `, ${order.region}` : ""} {order.zip}
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {order.lines.map((l) => (
            <li key={l.id} className="flex justify-between">
              <span>{l.name} × {l.qty}</span>
              <span>{money(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-black/10 pt-3 font-semibold">
          <span>Total</span>
          <span>{money(order.total)}</span>
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="rounded-full bg-[#12141c] px-4 py-2 text-sm font-semibold text-white">
          Keep shopping
        </Link>
        <Link to="/account" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
          View account
        </Link>
      </div>
    </div>
  );
}
