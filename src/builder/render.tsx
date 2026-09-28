import type { ComponentProps } from "react";
import { baseRenders, setImageVariants } from "@builder/components-base/render";
import { createRegistry } from "@builder/react";
import { ShareButtonsView, navMenuProps, nestedMenuProps, proRenders } from "@builder/components-pro/render";
import { site } from "../../builder.config";
import { DemoHeader } from "../app/site-parts";
import { Accordion, Carousel, CopyLink, Countdown, Counter, Form, Gallery, Lottie, Motion, NavMenu, NestedAccordion, Popup, Search, Slides, TableOfContents, Tabs, TestimonialCarousel, VideoGallery } from "./lazy-widgets";

// Responsive images: widths pre-rendered by scripts/image-variants.mjs (production build only; in
// development the originals are used). Images uploaded in the builder also have AVIF versions.
const WIDTHS = [384, 640, 1080, 1920];
if (process.env.NODE_ENV === "production")
  setImageVariants((src, width) => {
    if (!/^\/images\/[\w./-]+\.(png|jpe?g|webp)$/i.test(src)) return null;
    // [folder, real width]: variants are never upscaled, so the smallest folder at or above the image's
    // width holds the image at its own size.
    const ws: [number, number][] = width ? [...WIDTHS.filter((w) => w < width).map((w): [number, number] => [w, w]), [WIDTHS.find((w) => w >= width) ?? 1920, Math.min(width, 1920)]] : WIDTHS.map((w) => [w, w]);
    const set = (s: string) => ws.map(([dir, w]) => `/_img/${dir}${s} ${w}w`).join(", ");
    return { srcSet: set(src), ...(src.includes("/uploads/builder/") ? { avifSrcSet: set(src.replace(/\.\w+$/, ".avif")) } : {}) };
  });

export const registry = createRegistry(site, {
  ...baseRenders,
  ...proRenders,
  // Site widget slots: what each name shows is the site's own code.
  "site/Slot": ({ name }) =>
    name === "opening-hours" ? (
      <p className="demo-hours">Open Monday to Friday, 9:00–18:00</p>
    ) : (
      <p className="demo-hours">1,024 subscribers</p>
    ),
  "base/Gallery": (p) => <Gallery {...p} />,
  "base/Carousel": (p) => <Carousel {...p} />,
  "base/VideoGallery": (p) => <VideoGallery {...p} />,
  "base/Accordion": (p) => <Accordion {...p} />,
  "base/NestedAccordion": (p) => <NestedAccordion {...p} />,
  "base/Tabs": (p) => <Tabs {...p} />,
  "base/Popup": (p) => <Popup {...p} />,
  "pro/ShareButtons": (p) => <ShareButtonsView {...p} CopyButton={CopyLink} />,
  "pro/Counter": (p) => <Counter {...p} />,
  "pro/Countdown": (p) => <Countdown {...p} />,
  "pro/TableOfContents": (p) => <TableOfContents {...p} />,
  "pro/Slides": (p) => <Slides {...p} />,
  "pro/TestimonialCarousel": (p) => <TestimonialCarousel {...p} />,
  "pro/Lottie": (p) => <Lottie {...p} />,
  "pro/Search": (p) => <Search {...p} />,
  "pro/Form": (p) => <Form {...(p as ComponentProps<typeof Form>)} />,
  "pro/NavMenu": (p) => <NavMenu {...navMenuProps(p)} />,
  "pro/NestedMenu": (p) => <NavMenu {...nestedMenuProps(p)} />,
  "demo/SiteHeader": () => <DemoHeader />,
  "demo/Newsletter": ({ label, button }) => (
    <div className="demo-news">
      <label>
        <span>{label}</span>
        <input type="email" name="email" placeholder="name@example.com" autoComplete="email" />
      </label>
      <button type="button">{button}</button>
    </div>
  ),
  "demo/Hero": ({ title, subtitle, ctaLabel, ctaLink }) => (
    <section className="demo-hero">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {ctaLabel && ctaLink && (
        <a className="demo-btn" href={ctaLink}>
          {ctaLabel}
        </a>
      )}
    </section>
  ),
}, { motion: Motion });
