/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow any HTTPS host so product images (Fragrantica's fimgs.net CDN, or an
    // owner-supplied `Image` column URL) work without further config.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async redirects() {
    // The shop used to live at /catalog; keep old links working.
    return [{ source: '/catalog', destination: '/shop', permanent: true }];
  },
};

export default nextConfig;
