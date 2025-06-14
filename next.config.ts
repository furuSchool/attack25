import type { NextConfig } from "next";

const repo = "attack25";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
};

export default nextConfig;
