import { notFound } from "next/navigation";
import { getPosts } from "@/builder/pages";
import { SiteChrome } from "../../SiteChrome";

export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map((p) => ({ id: p.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPosts().find((x) => x.id === id);
  return p ? { title: p.title, description: p.excerpt } : {};
}

/** A blog post (site code): its card on /blog/ comes from the Theme Builder's Loop item. */
export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPosts().find((x) => x.id === id);
  if (!p) notFound();
  return (
    <SiteChrome route={{ path: `/posts/${p.id}/`, kind: "singular", type: "post", title: p.title }} dynamic={{ page: { title: p.title, path: `/posts/${p.id}/`, date: String(p.date), excerpt: p.excerpt } }}>
      <article className="demo-post">
        <h1>{p.title}</h1>
        {p.body
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        <p>
          <a href="/blog/">← All posts</a>
        </p>
      </article>
    </SiteChrome>
  );
}
