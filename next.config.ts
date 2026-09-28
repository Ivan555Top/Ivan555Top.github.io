import type { NextConfig } from "next";

// Fully static export, like the pilot site: the builder never needs a server on the public side.
const config: NextConfig = { output: "export", trailingSlash: true, images: { unoptimized: true } };
export default config;
