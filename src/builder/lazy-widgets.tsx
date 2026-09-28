"use client";

// Interactive widgets load lazily: pages that do not use them do not download their code.
import dynamic from "next/dynamic";

export const Gallery = dynamic(() => import("@builder/components-base/gallery").then((m) => m.GalleryView));
export const Carousel = dynamic(() => import("@builder/components-base/gallery").then((m) => m.CarouselView));
export const VideoGallery = dynamic(() => import("@builder/components-base/gallery").then((m) => m.VideoGalleryView));
export const Accordion = dynamic(() => import("@builder/components-base/accordion").then((m) => m.AccordionView));
export const NestedAccordion = dynamic(() => import("@builder/components-base/accordion").then((m) => m.NestedAccordionView));
export const Tabs = dynamic(() => import("@builder/components-base/accordion").then((m) => m.TabsView));
export const Popup = dynamic(() => import("@builder/components-base/popup").then((m) => m.PopupView));
export const Counter = dynamic(() => import("@builder/components-pro/counter").then((m) => m.CounterView));
export const Countdown = dynamic(() => import("@builder/components-pro/countdown").then((m) => m.CountdownView));
export const TableOfContents = dynamic(() => import("@builder/components-pro/toc").then((m) => m.TableOfContentsView));
export const Slides = dynamic(() => import("@builder/components-pro/slides").then((m) => m.SlidesView));
export const TestimonialCarousel = dynamic(() => import("@builder/components-pro/slides").then((m) => m.TestimonialCarouselView));
export const Lottie = dynamic(() => import("@builder/components-pro/lottie").then((m) => m.LottieView));
export const Search = dynamic(() => import("@builder/components-pro/search").then((m) => m.SearchView));
// Share buttons are plain links; only the "Copy link" button needs this small script.
export const CopyLink = dynamic(() => import("@builder/components-pro/share-client").then((m) => m.CopyLinkButton));
// Forms: the Form widget with the demo's actions and spam protection.
export const Form = dynamic(() => import("./form-client").then((m) => m.DemoFormView));
// Popups of the Theme Builder: the script loads only on pages that have one.
export const PopupHost = dynamic(() => import("@builder/react/popup").then((m) => m.PopupHost));
// Menus: rendered on the server (items, icons, mega sections); this small script opens dropdowns and the menu button.
export const NavMenu = dynamic(() => import("@builder/components-pro/nav-menu").then((m) => m.NavMenuView));
// Motion effects (entrance, scrolling-effect fallback, mouse effects): only on pages that use them.
export const Motion = dynamic(() => import("@builder/react/motion").then((m) => m.MotionRuntime));
