import type { MetadataRoute } from "next";
import { content, getPosts, SEO_SITE } from "@/builder/pages";

export const dynamic = "force-static";

/** Builder pages that are published, indexed and not excluded (Page Settings › SEO), and the posts. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [...content.sitemap({ changeFrequency: "monthly", priority: 0.8 }), ...getPosts().map((p) => ({ url: `${SEO_SITE.url}/posts/${p.id}/` }))];
}
