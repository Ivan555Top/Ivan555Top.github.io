"use client";

import "@puckeditor/core/no-external.css";
import { BuilderApp, BuilderSites, type BuilderAppProps } from "@builder/editor";
import { starterKit } from "@builder/components-base/kit";
import type { DynamicData, RenderContext, Role, SeoSite } from "@builder/core";
import type { ThemeSiteInfo } from "@builder/editor";
import { registry } from "@/builder/render";

// Demo repository. The e2e tests answer the GitHub API calls themselves, so no real repository is needed.
const REPO = { owner: "Ivan555Top", name: "Ivan555Top.github.io", branch: "main" };
const query = (k: string) => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get(k));
// Autosave delay in seconds; tests shorten it with ?autosave=2.
const autosave = () => Number(query("autosave")) || undefined;
// Tests: ?role=editor shows the editor as an editor sees it (no Developer panel); ?crash=<widget type> makes that
// widget throw on the canvas (the error boundary and the Developer panel's errors).
const role = () => (query("role") as Role | null) ?? undefined;
const withCrash = () => {
  const t = query("crash");
  return t && registry.renders[t]
    ? {
        ...registry,
        renders: {
          ...registry.renders,
          [t]: () => {
            throw new Error(`Test crash of ${t}`);
          },
        },
      }
    : registry;
};

export function BuilderClient({ reservedPaths, context, theme, dynamic, seo }: { reservedPaths: string[]; context: Omit<RenderContext, "page">; theme: ThemeSiteInfo; dynamic: DynamicData; seo: SeoSite }) {
  const main: BuilderAppProps = {
    registry: withCrash(),
    role: role(),
    repo: REPO,
    contentRoot: "content/builder/",
    siteUrl: "https://ivan555top.github.io",
    // Help › "Open the full guide".
    helpUrl: "https://github.com/Ivan555Top/site-builder/blob/main/docs/user-guide-ru.md",
    reservedPaths,
    context,
    kits: [starterKit],
    theme,
    dynamic,
    seo,
    autosave: autosave(),
    checkPath: (p) => (/^\/[a-z0-9-]+\/$/.test(p) ? null : "Use one level: /your-page/"),
    // The canvas shows the Theme Builder header and footer around the page (the editor renders them).
    Frame: ({ children }) => <>{children}</>,
  };
  // Multi-site (?sites=2): a sister site with the same widgets and its own content folder and address.
  if (query("sites") === "2")
    return (
      <BuilderSites
        sites={[
          { id: "studio", label: "Demo Studio", props: main },
          {
            id: "landing",
            label: "Demo landing pages",
            props: { ...main, contentRoot: "content/landing/", siteUrl: "https://landing.demo.example.com", reservedPaths: [], theme: { routes: [], types: { page: "Page" } }, seo: { ...seo, name: "Demo landing pages", url: "https://landing.demo.example.com" } },
          },
        ]}
      />
    );
  return <BuilderApp {...main} />;
}
