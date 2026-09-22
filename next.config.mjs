/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The content loader (lib/content.ts) reads public/content from disk at
    // build time, which makes Next's file tracer conservatively bundle every
    // image in that tree into each serverless function. The photos are static
    // CDN assets and never belong in a function, so exclude them from tracing
    // — this keeps Vercel "Function Storage" from ballooning per deployment.
    outputFileTracingExcludes: {
      "*": [
        "./public/content/**/*.jpg",
        "./public/content/**/*.jpeg",
        "./public/content/**/*.png",
      ],
    },
  },
};

export default nextConfig;
