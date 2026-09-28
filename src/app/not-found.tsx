import type { Metadata } from "next";
import { SiteChrome } from "./SiteChrome";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404: the 404 template of the Theme Builder; without one, a plain message. */
export default function NotFound() {
  return (
    <SiteChrome route={{ path: "/404/", kind: "404", title: "Page not found" }}>
      <p>This page does not exist.</p>
    </SiteChrome>
  );
}
