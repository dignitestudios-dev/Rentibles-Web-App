import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "api.dicebear.com",
      "rentibles-bucket.s3.us-west-2.amazonaws.com",
      "media.istockphoto.com",
    ],
  },
};

export default nextConfig;
