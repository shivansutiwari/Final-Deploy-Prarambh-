
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Required for static export
  },
  output: 'export', // Enable static export
  trailingSlash: true, // Add trailing slashes to URLs
  distDir: 'out', // Output directory for static files
  assetPrefix: '', // Ensure assets are served from root
  basePath: '', // Ensure no base path is set
};

export default nextConfig;
