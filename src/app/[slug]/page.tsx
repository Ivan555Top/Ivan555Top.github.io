import { BuilderRender, PageJsonLd } from "@builder/react";
import { notFound } from "next/navigation";
import { registry } from "@/builder/render";
import { content, getPage, getRenderContext, getSiteSettings, getTemplates, pageDynamic, pageMetadata, routeOf, JSONLD_BUILDERS, SEO_SITE } from "@/builder/pages";
import { SiteChrome } from "../SiteChrome";

export const dynamicParams = false;

export const generateStaticParams = () => content.slugParams();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPage(`/${(await params).slug}/`);
  return page ? pageMetadata(page) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = getPage(`/${(await params).slug}/`);
  if (!page) notFound();
  return (
    <SiteChrome route={routeOf(page)} page={page.settings} dynamic={await pageDynamic(page)}>
      <BuilderRender registry={registry} page={page} templates={getTemplates()} settings={getSiteSettings()} context={{ ...getRenderContext(), dynamic: await pageDynamic(page) }} />
      <PageJsonLd page={page} registry={registry} site={SEO_SITE} templates={getTemplates()} builders={JSONLD_BUILDERS} />
    </SiteChrome>
  );
}
