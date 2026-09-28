import { BuilderRender, PageJsonLd } from "@builder/react";
import { notFound } from "next/navigation";
import { registry } from "@/builder/render";
import { getPage, getRenderContext, getSiteSettings, getTemplates, pageDynamic, pageMetadata, routeOf, JSONLD_BUILDERS, SEO_SITE } from "@/builder/pages";
import { SiteChrome } from "./SiteChrome";

export function generateMetadata() {
  const page = getPage("/");
  return page ? pageMetadata(page) : {};
}

export default async function Home() {
  const page = getPage("/");
  if (!page) notFound();
  return (
    <SiteChrome route={routeOf(page)} page={page.settings} dynamic={await pageDynamic(page)}>
      <BuilderRender registry={registry} page={page} templates={getTemplates()} settings={getSiteSettings()} context={{ ...getRenderContext(), dynamic: await pageDynamic(page) }} />
      <PageJsonLd page={page} registry={registry} site={SEO_SITE} templates={getTemplates()} builders={JSONLD_BUILDERS} />
    </SiteChrome>
  );
}
