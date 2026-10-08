/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Indikator dev Next.js disembunyikan agar rekaman/screenshot tutorial bersih.
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "novel",
      "@tiptap/react",
      "@tiptap/starter-kit"
    ]
  }
};

export default nextConfig;
