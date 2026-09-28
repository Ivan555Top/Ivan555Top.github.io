import type { Metadata } from "next";
import { SiteChrome } from "../SiteChrome";

// Search results are not indexed (robots: noindex), on purpose; the description is for sharing and browsers.
export const metadata: Metadata = { title: "Search", description: "Search every page and post of the demo site.", robots: { index: false } };

/** Search results page: made entirely in the Theme Builder (Search results template with the Search widget). */
export default function SearchPage() {
  return <SiteChrome route={{ path: "/search/", kind: "search", title: "Search" }}>{null}</SiteChrome>;
}
