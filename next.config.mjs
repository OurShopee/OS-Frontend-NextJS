import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Serve React app static assets directly
        {
          source: "/react-build/static/:path*",
          destination: "/react-build/static/:path*",
        },
        // Explicitly ensure homepage is handled by Next.js
        {
          source: "/",
          destination: "/",
        },
      ],
      afterFiles: [
        // Match everything EXCEPT empty path ("") and single slash ("/")
        {
          source: "/(.+)", // This matches ONLY paths with at least one character after "/"
          destination: "/react-build/index.html",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/react-build/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@images": path.resolve(__dirname, "src/images"),
    };
    return config;
  },
};

export default nextConfig;
