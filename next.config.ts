import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Turbopack scoped to this app. The parent folder contains sibling
  // projects, and without an explicit root Turbopack can walk upward and fail
  // to resolve this app's Next.js package during HMR.
  turbopack: {
    root: projectRoot,
  },

  async headers() {
    return [
      {
        source: "/unity/Build/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
      {
        source: "/unity/Build/:path*.wasm",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
        ],
      },
      {
        // Long-lived cache for /public/images — required so external image
        // proxies (Gmail / Outlook / Apple Mail) cache and embed them.
        // Without this, Next.js sends `max-age=0` which makes Gmail refuse
        // to proxy the image and silently strip the <img src>.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
