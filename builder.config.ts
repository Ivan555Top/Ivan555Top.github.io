// Site package of the demo site: everything site-specific lives here and in src/builder — never in the
// builder packages. A new site plugs in the same way (see docs/connect-a-site.md, Phase 19).
import { baseComponents, defineSiteSlots } from "@builder/components-base";
import { NestedMenu, formWidget, navMenuWidget, proComponents } from "@builder/components-pro";
import { defineSite, defineWidget, f } from "@builder/sdk";
// A third-party widget (examples/widget-timeline): one file, added with one line in `components` below.
import { Timeline } from "@acme/builder-timeline";

/** A site-specific widget, declared with the Widget API (icon, keywords, migrations, validate). */
export const DemoHero = defineWidget({
  type: "demo/Hero",
  version: 2,
  label: "Hero (demo)",
  category: "sections",
  icon: "hero",
  description: "Large heading with a call to action",
  keywords: ["banner", "header", "intro"],
  fields: {
    title: f.text({ label: "Title", required: true, maxLength: 80, inline: true }),
    subtitle: f.textarea({ label: "Subtitle", maxLength: 240 }),
    ctaLabel: f.text({ label: "Button text", maxLength: 40 }),
    ctaLink: f.link({ label: "Button link" }),
  },
  styles: ["spaceTop", "spaceBottom", "background", "textColor", "align"],
  seo: { heading: { level: 1, text: "title" } },
  defaults: { title: "Build pages visually", subtitle: "A neutral demo site for the builder.", ctaLabel: "Get started", ctaLink: "/kitchen-sink/" },
  // v1 stored the title as "heading" and had no button: stored pages keep working.
  migrations: { 1: (p) => ({ title: p.heading ?? "Welcome", subtitle: p.subtitle }) },
  validate: (p) => (p.ctaLabel && !p.ctaLink ? ["Button text needs a button link"] : []),
});

/** A site widget with parts: the email field and the button get their own Normal / Hover / Focus style. */
export const DemoNewsletter = defineWidget({
  type: "demo/Newsletter",
  version: 1,
  label: "Newsletter (demo)",
  category: "sections",
  icon: "mail",
  description: "Email field with a button (no sending in the demo)",
  keywords: ["email", "subscribe", "form"],
  fields: {
    label: f.text({ label: "Field label", required: true, maxLength: 40 }),
    button: f.text({ label: "Button text", required: true, maxLength: 30 }),
  },
  styles: ["spaceTop", "spaceBottom", "background", "textColor", "align", "radius", "boxShadow", "opacity"],
  parts: {
    field: { label: "Field", selector: "input", styles: ["background", "textColor", "border", "borderColor", "radius", "boxShadow", "paddingTop", "paddingBottom"], focus: "focus" },
    button: { label: "Button", selector: "button", styles: ["background", "textColor", "border", "borderColor", "radius", "boxShadow", "scale", "translateY", "transitionDuration"] },
  },
  defaults: { label: "Your email", button: "Subscribe" },
});

/**
 * The site's coded header as a widget (Theme Builder, D3): the Header template starts as exactly this
 * code, so switching to the Theme Builder changes nothing; parts can later be replaced by universal widgets.
 */
export const DemoSiteHeader = defineWidget({
  type: "demo/SiteHeader",
  version: 1,
  label: "Site header (demo)",
  category: "site",
  icon: "layout",
  description: "Logo and main menu of the demo site",
  keywords: ["header", "menu", "navigation", "logo"],
  fields: {},
  defaults: {},
  constraints: { maxPerPage: 1 },
});

/** Parts of the site the builder can place (Elementor's shortcode): the site's own code renders them. */
export const SiteSlot = defineSiteSlots({ "opening-hours": "Opening hours", "newsletter-count": "Subscriber count" });

/**
 * The demo's Form: its actions (the code is in src/builder/form-client.tsx). A demo endpoint stands in for the
 * studio's mail function; nothing secret is involved.
 */
export const DemoForm = formWidget({
  actions: [
    { id: "email", label: "Email to the studio", note: "the studio's mail endpoint sends it" },
    { id: "webhook", label: "Webhook (files allowed)", acceptsFiles: true, note: "JSON or multipart to the demo webhook" },
  ],
});

/**
 * The demo's menus (Menus view of the editor): each is a file of the site, in the site's own format. The main
 * menu offers everything (icons, descriptions, new tab, mega menus); the footer links are one level, plain.
 */
const MENUS = [
  { id: "main", label: "Main menu", path: "content/data/menu-main.json", key: "items", maxDepth: 3, features: { icons: true, descriptions: true, newTab: true, mega: true } },
  { id: "footer", label: "Footer links", path: "content/builder/menus/footer.json", key: "", maxDepth: 1, features: { newTab: true } },
] as const;
export const DemoNavMenu = navMenuWidget({ menus: MENUS });

export const site = defineSite({
  id: "demo",
  name: "Demo Studio",
  breakpoints: { tablet: 1023, mobile: 639 },
  colors: {
    white: { label: "White", value: "#ffffff" },
    ink: { label: "Ink", value: "#1f2937" },
    brand: { label: "Brand", value: "var(--demo-brand)" },
    soft: { label: "Soft", value: "var(--demo-soft)" },
  },
  fonts: { sans: { label: "System sans", value: "system-ui, sans-serif" }, serif: { label: "Serif", value: "Georgia, serif" } },
  // The demo shows the product with custom CSS allowed (validated, scoped); ARD keeps it off (CLAUDE.md).
  // The HTML widget runs in a sandboxed frame (the demo shows it; ARD keeps it off).
  capabilities: { customCss: "designer", htmlWidget: "sandboxed", headCode: "off", svgUpload: "off" },
  cssClasses: { "demo-card": "Card (white, rounded)", "demo-muted": "Muted text" },
  // Public data for Dynamic tags: only these fields ever reach pages or the editor (content/data/*).
  dynamic: {
    siteFields: {
      phone: { label: "Phone", kind: "text" },
      phoneLink: { label: "Phone (link)", kind: "link" },
      email: { label: "Email", kind: "text" },
      hours: { label: "Opening hours", kind: "text" },
    },
    pageFields: { description: { label: "SEO description", kind: "text" } },
    collections: [
      { id: "team", label: "Team", fields: [{ name: "name", label: "Name", kind: "text" }, { name: "role", label: "Role", kind: "text" }] },
      {
        id: "posts",
        label: "Blog posts",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "date", label: "Date", kind: "date" },
          { name: "category", label: "Category", kind: "text" },
          { name: "excerpt", label: "Excerpt", kind: "text" },
          { name: "image", label: "Image", kind: "image" },
          { name: "url", label: "Address", kind: "link" },
        ],
      },
    ],
  },
  menus: MENUS.map((m) => ({ ...m, features: { ...m.features } })),
  // Structured data types of the demo besides the built-in ones (Page Settings › SEO), built in src/builder/pages.ts.
  structuredData: { service: "Service" },
  components: [...baseComponents, ...proComponents, DemoNavMenu, NestedMenu, DemoForm, SiteSlot, DemoHero, DemoNewsletter, DemoSiteHeader, Timeline],
});
