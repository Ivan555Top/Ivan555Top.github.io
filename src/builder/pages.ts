import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { BuilderPage, DynamicData, JsonLdBuilder, SeoSite, ThemeRoute } from "@builder/core";
import { publicFields } from "@builder/core";
import { buildSnapshot, localJsonAdapter, mdxAdapter, frontmatter } from "@builder/data";
import { createBuilderContent } from "@builder/next/content";
import { registry } from "./render";

// Pages, templates, Theme Builder templates, menus and Site Settings come from content/builder through the
// builder's content loader (@builder/next/content): every file is checked at build time, so an invalid page
// fails the build and the live site never changes to a broken state.

/** The site as its metadata and structured data see it (Page Settings › SEO / Social, editor previews). */
export const SEO_SITE: SeoSite = { name: "Demo Studio", url: "https://demo.example.com", locale: "en_US", titleTemplate: "%s · Demo Studio", defaultImage: "/images/uploads/demo/demo-1.png", defaultSchema: "webpage" };

/** Routes besides builder pages (for Theme Builder conditions and menu link checks). */
const otherRoutes = (): ThemeRoute[] => [
  ...getPosts().map((p): ThemeRoute => ({ path: `/posts/${p.id}/`, kind: "singular", type: "post", title: p.title })),
  { path: "/pages/", kind: "archive", type: "page", title: "All pages" },
  { path: "/search/", kind: "search", title: "Search" },
  { path: "/404/", kind: "404", title: "Page not found" },
];

export const content = createBuilderContent({ registry, seo: SEO_SITE, routes: otherRoutes });
export const { getSiteSettings, getTemplates, getAllPages, getPages, getPage, getTheme, getRoutes, getMenus, siteMode, routeOf } = content;

/** The site's own structured data types (builder.config.ts › structuredData), built from the page. */
export const JSONLD_BUILDERS: Record<string, JsonLdBuilder> = {
  service: (p, site) => ({ "@type": "Service", name: p.title, ...(p.seo.description ? { description: p.seo.description } : {}), provider: { "@type": "Organization", name: site.name, url: site.url }, areaServed: "Online" }),
};

/** Title, description, canonical, robots, Open Graph and Twitter of a builder page (Page Settings). */
export const pageMetadata = (p: BuilderPage): Metadata => content.pageMetadata(p) as Metadata;

/** What navigation widgets (breadcrumbs, sitemap, menus) know about the site, and the Loop cards. */
export const getRenderContext = content.renderContext;

/* ---------- Dynamic tags: public data (only the fields declared in builder.config.ts › dynamic) ---------- */

const DATA = path.join(process.cwd(), "content", "data");
const dataAdapter = localJsonAdapter({
  collections: {
    team: { label: "Team", file: path.join(DATA, "team.json"), select: "people", fields: registry.site.dynamic!.collections![0]!.fields },
  },
});
const POSTS = path.join(process.cwd(), "content", "posts");
const postsAdapter = mdxAdapter({ collections: { posts: { label: "Blog posts", dir: POSTS, fields: registry.site.dynamic!.collections![1]!.fields } } });

/** Blog posts (content/posts/*.md): frontmatter and body, for the post pages. */
export const getPosts = () =>
  fs
    .readdirSync(POSTS)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const text = fs.readFileSync(path.join(POSTS, f), "utf8");
      const fm = frontmatter(text) as { title: string; date: string; excerpt: string };
      return { id: f.replace(/\.md$/, ""), ...fm, body: text.replace(/^---[\s\S]*?---\s*/, "") };
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

let dynamicCache: Promise<DynamicData> | null = null;
/** Site info and collections for Dynamic tags, the same for every page of one build (and the editor preview). */
export function getDynamicData(): Promise<DynamicData> {
  dynamicCache ??= (async () => {
    const site = JSON.parse(fs.readFileSync(path.join(DATA, "site.json"), "utf8")) as Record<string, string>;
    const defs = registry.manifest.site.dynamic!;
    return {
      site: { name: "Demo Studio", url: "https://demo.example.com", fields: publicFields({ ...site, phoneLink: `tel:${site.phoneE164}` }, defs.siteFields) },
      // Posts get their address and an image object (alt = title) before the whitelist is applied.
      data: await buildSnapshot([dataAdapter, postsAdapter], defs, (c, r) =>
        c === "posts" ? { ...r, date: String(r.date), url: `/posts/${r.id}/`, ...(typeof r.image === "string" ? { image: { src: r.image, alt: String(r.title) } } : {}) } : r,
      ),
      now: new Date().toISOString(),
    };
  })();
  return dynamicCache;
}

/** Dynamic data of one builder page (its own fields on top of the site's). */
export async function pageDynamic(p: BuilderPage): Promise<DynamicData> {
  const d = await getDynamicData();
  return { ...d, page: { title: p.title, path: p.path, excerpt: p.seo.description, fields: publicFields({ description: p.seo.description }, registry.manifest.site.dynamic?.pageFields) } };
}
