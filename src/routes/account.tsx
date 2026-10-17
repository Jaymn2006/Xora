import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { money, useShop } from "@/store/shop";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const user = useShop((s) => s.user);
  const orders = useShop((s) => s.orders);
  const register = useShop((s) => s.register);
  const login = useShop((s) => s.login);
  const logout = useShop((s) => s.logout);
  const requestReset = useShop((s) => s.requestReset);
  const resetPassword = useShop((s) => s.resetPassword);
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [show, setShow] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const mine = user ? orders.filter((o) => o.email === user.email) : [];

  if (user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#2f6bff] uppercase">Account</p>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-sm text-black/55">{user.email}</p>
          </div>
          <button
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
            onClick={() => {
              logout();
              toast("Signed out.");
            }}
          >
            Log out
          </button>
        </div>
        <h2 className="mt-8 text-lg font-semibold">Orders</h2>
        {mine.length === 0 ? (
          <p className="mt-2 text-sm text-black/55">
            No orders for this email yet.{" "}
            <Link to="/shop" search={{ q: "", cat: "All", sort: "featured" }} className="text-[#2f6bff]">
              Start a bag
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {mine.map((o) => (
              <li key={o.id}>
                <Link to="/order/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span>
                    <span className="block font-semibold">{o.id}</span>
                    <span className="text-xs text-black/50">{new Date(o.at).toLocaleString()} · {o.lines.length} items</span>
                  </span>
                  <span className="font-semibold">{money(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold">
        {tab === "login" ? "Log in" : tab === "register" ? "Create account" : "Reset password"}
      </h1>
      <p className="mt-1 text-sm text-black/55">Saved only in this browser. No password leaves the device.</p>
      <div className="mt-4 flex gap-2 text-sm">
        {(["login", "register", "forgot"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3 py-1.5 font-medium ${tab === t ? "bg-[#12141c] text-white" : "bg-white"}`}
          >
            {t === "login" ? "Login" : t === "register" ? "Register" : "Forgot"}
          </button>
        ))}
      </div>

      {tab === "login" && (
        <Form
          show={show}
          setShow={setShow}
          fields={["email", "password"]}
          submit="Log in"
          onSubmit={(v) => {
            const res = login(v.email, v.password);
            toast(res.message);
          }}
        />
      )}
      {tab === "register" && (
        <Form
          show={show}
          setShow={setShow}
          fields={["name", "email", "password"]}
          submit="Create account"
          onSubmit={(v) => {
            const res = register(v.name, v.email, v.password);
            toast(res.message);
          }}
        />
      )}
      {tab === "forgot" && (
        <Forgot
          show={show}
          setShow={setShow}
          code={resetCode}
          onRequest={(email) => {
            const res = requestReset(email);
            toast(res.message);
            if (res.code) setResetCode(res.code);
          }}
          onReset={(email, code, password) => {
            const res = resetPassword(email, code, password);
            toast(res.message);
            if (res.ok) setTab("login");
          }}
        />
      )}
    </div>
  );
}

function Form({
  fields,
  submit,
  show,
  setShow,
  onSubmit,
}: {
  fields: Array<"name" | "email" | "password">;
  submit: string;
  show: boolean;
  setShow: (v: boolean) => void;
  onSubmit: (v: { name: string; email: string; password: string }) => void;
}) {
  const [v, setV] = useState({ name: "", email: "", password: "" });
  return (
    <form
      className="mt-5 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(v);
      }}
    >
      {fields.includes("name") && (
        <input required placeholder="Name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5" />
      )}
      {fields.includes("email") && (
        <input required type="email" placeholder="Email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5" />
      )}
      {fields.includes("password") && (
        <div className="relative">
          <input
            required
            minLength={6}
            type={show ? "text" : "password"}
            placeholder="Password"
            value={v.password}
            onChange={(e) => setV({ ...v, password: e.target.value })}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 pr-16"
          />
          <button type="button" className="absolute top-2.5 right-3 text-xs font-semibold text-black/50" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      )}
      <button className="w-full rounded-full bg-[#2f6bff] py-3 text-sm font-semibold text-white">{submit}</button>
    </form>
  );
}

function Forgot({
  show,
  setShow,
  code,
  onRequest,
  onReset,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
  code: string;
  onRequest: (email: string) => void;
  onReset: (email: string, code: string, password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [entered, setEntered] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="mt-5 space-y-3">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onRequest(email);
        }}
      >
        <input required type="email" placeholder="Account email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5" />
        <button className="w-full rounded-full bg-[#12141c] py-2.5 text-sm font-semibold text-white">Send reset code</button>
      </form>
      {code && (
        <p className="rounded-xl bg-[#e8efff] px-3 py-2 text-sm">
          Your code: <span className="font-semibold">{code}</span>
        </p>
      )}
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onReset(email, entered, password);
        }}
      >
        <input required placeholder="Reset code" value={entered} onChange={(e) => setEntered(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5" />
        <div className="relative">
          <input
            required
            minLength={6}
            type={show ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 pr-16"
          />
          <button type="button" className="absolute top-2.5 right-3 text-xs font-semibold" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
        <button className="w-full rounded-full bg-[#2f6bff] py-2.5 text-sm font-semibold text-white">Update password</button>
      </form>
    </div>
  );
}
