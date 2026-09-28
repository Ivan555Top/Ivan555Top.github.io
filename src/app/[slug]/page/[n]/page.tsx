import { BuilderRender } from "@builder/react";
import { paginationPaths } from "@builder/core";
import { notFound } from "next/navigation";
import { registry } from "@/builder/render";
import { getDynamicData, getPage, getPages, getRenderContext, getSiteSettings, getTemplates, pageDynamic, pageMetadata, routeOf } from "@/builder/pages";
import { SiteChrome } from "../../../SiteChrome";

// Pages 2… of builder pages whose Loop paginates (/blog/page/2/). Generated at build time from the data, so
// the static export has every page; page 1 is the page itself.

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = (await getDynamicData()).data;
  return getPages().flatMap((p) => paginationPaths(p.path, p.root, data).map((path) => ({ slug: p.path.slice(1, -1), n: path.split("/").at(-2)! })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; n: string }> }) {
  const { slug, n } = await params;
  const page = getPage(`/${slug}/`);
  if (!page) return {};
  const m = pageMetadata(page);
  return { ...m, title: `${page.seo.title ?? page.title} — page ${n}`, alternates: { canonical: `/${slug}/page/${n}/` } };
}

export default async function Paged({ params }: { params: Promise<{ slug: string; n: string }> }) {
  const { slug, n } = await params;
  const page = getPage(`/${slug}/`);
  if (!page) notFound();
  const dynamic = { ...(await pageDynamic(page)), route: { page: n } };
  return (
    <SiteChrome route={{ ...routeOf(page), path: `/${slug}/page/${n}/` }} page={page.settings} dynamic={dynamic}>
      <BuilderRender registry={registry} page={page} templates={getTemplates()} settings={getSiteSettings()} context={{ ...getRenderContext(), dynamic }} />
    </SiteChrome>
  );
}
