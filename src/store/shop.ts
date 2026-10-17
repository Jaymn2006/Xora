import { create } from "zustand";
import { persist } from "zustand/middleware";
import { coupons, getProduct } from "@/data/catalog";

export type CartLine = { id: string; qty: number };

export type Order = {
  id: string;
  at: number;
  email: string;
  name: string;
  line1: string;
  city: string;
  region: string;
  zip: string;
  last4: string;
  lines: { id: string; name: string; price: number; qty: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon: string | null;
};

type Account = { name: string; email: string; pass: string };

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  coupon: string | null;
  user: { name: string; email: string } | null;
  accounts: Account[];
  resets: Record<string, string>;
  orders: Order[];
  newsletter: string[];
  add: (id: string, qty?: number) => { ok: boolean; message: string };
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => boolean;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  login: (email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  requestReset: (email: string) => { ok: boolean; message: string; code?: string };
  resetPassword: (
    email: string,
    code: string,
    password: string,
  ) => { ok: boolean; message: string };
  placeOrder: (info: {
    email: string;
    name: string;
    line1: string;
    city: string;
    region: string;
    zip: string;
    card: string;
  }) => { ok: boolean; message: string; id?: string };
  subscribe: (email: string) => { ok: boolean; message: string };
};

function hashPass(password: string, email: string) {
  const s = `${email.trim().toLowerCase()}::${password}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export function pricing(cart: CartLine[], couponCode: string | null) {
  const lines = cart
    .map((line) => {
      const product = getProduct(line.id);
      if (!product) return null;
      return { product, qty: line.qty };
    })
    .filter((x): x is { product: NonNullable<ReturnType<typeof getProduct>>; qty: number } => !!x);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const coupon = couponCode ? coupons[couponCode] : undefined;
  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
  const after = Math.max(0, subtotal - discount);
  const free = !!coupon?.freeShip || after >= 200 || after === 0;
  const shipping = after === 0 ? 0 : free ? 0 : 9.95;
  const tax = Math.round(after * 0.08 * 100) / 100;
  const total = Math.round((after + shipping + tax) * 100) / 100;
  return { lines, subtotal, discount, shipping, tax, total, coupon };
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      coupon: null,
      user: null,
      accounts: [],
      resets: {},
      orders: [],
      newsletter: [],
      add: (id, qty = 1) => {
        const product = getProduct(id);
        if (!product) return { ok: false, message: "That product is no longer listed." };
        const existing = get().cart.find((l) => l.id === id);
        const next = (existing?.qty ?? 0) + qty;
        if (next > product.stock) {
          return { ok: false, message: `Only ${product.stock} left of ${product.name}.` };
        }
        set({
          cart: existing
            ? get().cart.map((l) => (l.id === id ? { ...l, qty: next } : l))
            : [...get().cart, { id, qty }],
        });
        return { ok: true, message: `${product.name} added to bag.` };
      },
      setQty: (id, qty) => {
        const product = getProduct(id);
        if (!product) return;
        if (qty <= 0) {
          set({ cart: get().cart.filter((l) => l.id !== id) });
          return;
        }
        const clamped = Math.min(qty, product.stock);
        set({ cart: get().cart.map((l) => (l.id === id ? { ...l, qty: clamped } : l)) });
      },
      remove: (id) => set({ cart: get().cart.filter((l) => l.id !== id) }),
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWish: (id) => {
        const has = get().wishlist.includes(id);
        set({
          wishlist: has ? get().wishlist.filter((x) => x !== id) : [...get().wishlist, id],
        });
        return !has;
      },
      applyCoupon: (code) => {
        const key = code.trim().toUpperCase();
        const found = coupons[key];
        if (!found) return { ok: false, message: "That code is not active." };
        if (get().cart.length === 0) return { ok: false, message: "Add something before using a code." };
        set({ coupon: key });
        return { ok: true, message: `${key} applied — ${found.label}.` };
      },
      clearCoupon: () => set({ coupon: null }),
      register: (name, email, password) => {
        const clean = email.trim().toLowerCase();
        if (name.trim().length < 2) return { ok: false, message: "Enter your full name." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, message: "Enter a valid email." };
        if (password.length < 6) return { ok: false, message: "Password needs at least 6 characters." };
        if (get().accounts.some((a) => a.email === clean)) {
          return { ok: false, message: "An account with that email already exists. Log in instead." };
        }
        const account = { name: name.trim(), email: clean, pass: hashPass(password, clean) };
        set({ accounts: [...get().accounts, account], user: { name: account.name, email: clean } });
        return { ok: true, message: `Welcome, ${account.name}.` };
      },
      login: (email, password) => {
        const clean = email.trim().toLowerCase();
        const account = get().accounts.find((a) => a.email === clean);
        if (!account || account.pass !== hashPass(password, clean)) {
          return { ok: false, message: "Email or password does not match." };
        }
        set({ user: { name: account.name, email: clean } });
        return { ok: true, message: `Signed in as ${account.name}.` };
      },
      logout: () => set({ user: null }),
      requestReset: (email) => {
        const clean = email.trim().toLowerCase();
        const account = get().accounts.find((a) => a.email === clean);
        if (!account) return { ok: false, message: "No account uses that email." };
        const code = String(Math.floor(100000 + Math.random() * 900000));
        set({ resets: { ...get().resets, [clean]: code } });
        return {
          ok: true,
          message: "Reset code ready. This demo shows it here because there is no mail server.",
          code,
        };
      },
      resetPassword: (email, code, password) => {
        const clean = email.trim().toLowerCase();
        if (get().resets[clean] !== code.trim()) return { ok: false, message: "That reset code is wrong." };
        if (password.length < 6) return { ok: false, message: "Password needs at least 6 characters." };
        set({
          accounts: get().accounts.map((a) =>
            a.email === clean ? { ...a, pass: hashPass(password, clean) } : a,
          ),
          resets: { ...get().resets, [clean]: "" },
        });
        return { ok: true, message: "Password updated. You can log in." };
      },
      placeOrder: (info) => {
        const priced = pricing(get().cart, get().coupon);
        if (priced.lines.length === 0) return { ok: false, message: "Your bag is empty." };
        const digits = info.card.replace(/\s+/g, "");
        if (!/^\d{16}$/.test(digits)) return { ok: false, message: "Enter a 16-digit card number. Any digits work in this demo." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) {
          return { ok: false, message: "Enter a valid email for the receipt." };
        }
        if (info.name.trim().length < 2 || info.line1.trim().length < 4 || info.city.trim().length < 2) {
          return { ok: false, message: "Complete the shipping address." };
        }
        const id = `XR-${Date.now().toString(36).toUpperCase()}`;
        const order: Order = {
          id,
          at: Date.now(),
          email: info.email.trim().toLowerCase(),
          name: info.name.trim(),
          line1: info.line1.trim(),
          city: info.city.trim(),
          region: info.region.trim(),
          zip: info.zip.trim(),
          last4: digits.slice(-4),
          lines: priced.lines.map((l) => ({
            id: l.product.id,
            name: l.product.name,
            price: l.product.price,
            qty: l.qty,
          })),
          subtotal: priced.subtotal,
          discount: priced.discount,
          shipping: priced.shipping,
          tax: priced.tax,
          total: priced.total,
          coupon: get().coupon,
        };
        set({ orders: [order, ...get().orders], cart: [], coupon: null });
        return { ok: true, message: "Order placed.", id };
      },
      subscribe: (email) => {
        const clean = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, message: "Enter a valid email." };
        if (get().newsletter.includes(clean)) return { ok: true, message: "You are already on the list." };
        set({ newsletter: [...get().newsletter, clean] });
        return { ok: true, message: "You are on the list. Watch for the XOR10 note." };
      },
    }),
    {
      name: "xora-shop",
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        coupon: s.coupon,
        user: s.user,
        accounts: s.accounts,
        resets: s.resets,
        orders: s.orders,
        newsletter: s.newsletter,
      }),
    },
  ),
);

export function money(n: number) {
  return `$${n.toFixed(2)}`;
}
