import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    // The try-on feature uses the MoveNet model, which never needs
    // MediaPipe. This stops the build failing on a package that has
    // no exports.
    resolveAlias: {
      "@mediapipe/pose": "./src/lib/mediapipePoseStub.ts",
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
