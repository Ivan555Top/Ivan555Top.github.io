import type { Metadata } from "next";
import { getPages } from "@/builder/pages";
import { SiteChrome } from "../SiteChrome";

export const metadata: Metadata = { title: "All pages" };

/** An archive route: the list is site code; the Archive template of the Theme Builder frames it. */
export default function AllPages() {
  return (
    <SiteChrome route={{ path: "/pages/", kind: "archive", type: "page", title: "All pages" }}>
      <ul className="demo-archive">
        {getPages().map((p) => (
          <li key={p.id}>
            <a href={p.path}>{p.title}</a>
          </li>
        ))}
      </ul>
    </SiteChrome>
  );
}
