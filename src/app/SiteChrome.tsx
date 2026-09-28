import { ThemeLayout } from "@builder/next";
import type { DynamicData, PageSettings, ThemeRoute } from "@builder/core";
import { registry } from "@/builder/render";
import { PopupHost } from "@/builder/lazy-widgets";
import { BuilderRender } from "@builder/react";
import { getDynamicData, getRenderContext, getSiteSettings, getTemplates, getTheme, siteMode } from "@/builder/pages";
import { DemoHeader, DemoFooter } from "./site-parts";

/**
 * Header, footer and page layout from the Theme Builder (content/builder/theme), chosen by each
 * template's display conditions for this route, and its popups. The coded header/footer stay as fallbacks.
 */
export async function SiteChrome({ route, page, dynamic, children }: { route: ThemeRoute; page?: PageSettings; dynamic?: DynamicData; children: React.ReactNode }) {
  // Site Settings › Site mode: coming soon / maintenance show one page on every address (no header / footer).
  const mode = siteMode(route.path);
  if (mode)
    return (
      <main data-b-site-mode={mode.status}>
        <BuilderRender registry={registry} page={mode.page} templates={getTemplates()} settings={getSiteSettings()} context={{ ...getRenderContext(), dynamic: await getDynamicData() }} />
      </main>
    );
  return (
    <ThemeLayout
      registry={registry}
      theme={getTheme()}
      route={route}
      page={page}
      templates={getTemplates()}
      settings={getSiteSettings()}
      context={{ ...getRenderContext(), dynamic: await getDynamicData() }}
      dynamic={dynamic}
      fallback={{ header: <DemoHeader />, footer: <DemoFooter /> }}
      main={(body) => <main data-pagefind-body="">{body}</main>}
      popupHost={PopupHost}
    >
      {children}
    </ThemeLayout>
  );
}
