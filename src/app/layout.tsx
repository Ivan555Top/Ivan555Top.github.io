import type { Metadata } from "next";
import { BuilderGlobalStyles } from "@builder/react";
import { builderFontFaces } from "@builder/next/fonts";
import { registry } from "@/builder/render";
import { getSiteSettings } from "@/builder/pages";
import "./globals.css";

// Coming soon / maintenance (Site Settings › Site mode): nothing is indexed until the site is live again.
const modeOn = (getSiteSettings()?.mode?.status ?? "live") !== "live";
export const metadata: Metadata = { title: { default: "Demo Studio", template: "%s · Demo Studio" }, metadataBase: new URL("https://demo.example.com"), ...(modeOn ? { robots: { index: false, follow: false } } : {}) };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Site Settings: global colours, typography presets, element styles (content/builder/site-settings.json) */}
        <BuilderGlobalStyles registry={registry} settings={getSiteSettings()} fontFaces={builderFontFaces()} />
        {children}
      </body>
    </html>
  );
}
