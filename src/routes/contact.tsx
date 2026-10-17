import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: ContactPage });

const KEY = "xora-messages";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(0);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#2f6bff] uppercase">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold">Write the desk</h1>
        <p className="mt-3 text-sm leading-relaxed text-black/65">
          Questions about an order, a coupon, or a product that is out of stock. Messages stay in this browser so you can confirm they were kept.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-black/45">Desk</dt>
            <dd>120 Signal Avenue, Harbor District</dd>
          </div>
          <div>
            <dt className="text-black/45">Hours</dt>
            <dd>Mon–Sat, 9:00–18:00</dd>
          </div>
          <div>
            <dt className="text-black/45">Mail</dt>
            <dd>desk@xora.shop</dd>
          </div>
        </dl>
        {sent > 0 && <p className="mt-4 text-sm font-medium text-[#2f6bff]">{sent} message{sent === 1 ? "" : "s"} saved on this device.</p>}
      </div>
      <form
        className="space-y-3 rounded-3xl bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const entry = { ...form, at: Date.now() };
          const prev = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown[];
          localStorage.setItem(KEY, JSON.stringify([entry, ...prev]));
          setSent(prev.length + 1);
          setForm({ name: "", email: "", subject: "", message: "" });
          toast("Message received. We will reply to that email in this demo world.");
        }}
      >
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
        <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
        <textarea required minLength={8} rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
        <button className="w-full rounded-full bg-[#2f6bff] py-3 text-sm font-semibold text-white">Send</button>
      </form>
    </div>
  );
}
