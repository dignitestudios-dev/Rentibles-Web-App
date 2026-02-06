import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "rentibles-bucket.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "media.istockphoto.com" },
    ],
  },
};

export default nextConfig;

