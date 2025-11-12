import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-dev.ourshopee.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.ourshopee.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
  // Ensure proper SSR
  serverExternalPackages: [],
  compiler: {
    removeConsole:
      process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@images": path.resolve(__dirname, "src/images"),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
