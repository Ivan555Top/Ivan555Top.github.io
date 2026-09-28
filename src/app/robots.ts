import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** The sandbox is a test site: nothing may be indexed. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
