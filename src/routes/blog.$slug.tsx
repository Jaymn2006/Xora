import { createFileRoute, Link } from "@tanstack/react-router";
import { getPost } from "@/data/catalog";

export const Route = createFileRoute("/blog/$slug")({ component: PostPage });

function PostPage() {
  const { slug } = Route.useParams();
  const post = getPost(slug);
  if (!post) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Article missing</h1>
        <Link to="/blog" className="mt-3 inline-block text-[#2f6bff]">All notes</Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/blog" className="text-sm text-black/50">← Journal</Link>
      <p className="mt-4 text-xs text-black/45">{post.date} · {post.read}</p>
      <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-black/75">
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </article>
  );
}
