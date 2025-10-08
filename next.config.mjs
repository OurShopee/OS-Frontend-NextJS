import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/react-build/static/:path*",
          destination: "/react-build/static/:path*",
        },
        {
          source: "/",
          destination: "/",
        },
        {
          source: "/details/:path*",
          destination: "/details/:path*",
        },
        {
          source: "/products-category/:path*",
          destination: "/products-category/:path*",
        },
      ],
      afterFiles: [
        {
          source: "/((?!details/).+)", // negative lookahead to exclude details
          destination: "/react-build/index.html",
        },
        {
          source: "/((?!products-category/).+)", // negative lookahead to exclude products-category
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
