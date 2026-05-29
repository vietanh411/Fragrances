/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow any HTTPS host so an owner-supplied product `Image` column (a public
    // image URL) works without further config. Hosts must be hot-linkable.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
