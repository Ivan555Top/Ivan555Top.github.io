import type { Metadata } from "next";
import { SEO_SITE, getDynamicData, getRenderContext, getRoutes } from "@/builder/pages";
import { BuilderClient } from "./BuilderClient";

export const metadata: Metadata = { title: "Site editor", robots: { index: false, follow: false } };

export default async function BuilderPage() {
  return <BuilderClient reservedPaths={["/builder/", "/pages/", "/search/"]} context={getRenderContext()} theme={{ routes: getRoutes(), types: { page: "Page" } }} dynamic={await getDynamicData()} seo={SEO_SITE} />;
}
