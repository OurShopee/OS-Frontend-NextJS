import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === "production" 
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
};

export default nextConfig;
