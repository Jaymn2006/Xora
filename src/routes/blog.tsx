import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/data/catalog";

export const Route = createFileRoute("/blog")({ component: BlogPage });

function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#2f6bff] uppercase">Journal</p>
      <h1 className="mt-1 text-3xl font-semibold">Notes from the shop floor</h1>
      <ul className="mt-8 space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to="/blog/$slug" params={{ slug: p.slug }} className="block rounded-3xl bg-white p-5 hover:shadow-md">
              <p className="text-xs text-black/45">{p.date} · {p.read}</p>
              <h2 className="mt-1 text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-black/65">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
