
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
  trailingSlash: false, // Remove trailing slashes to fix admin routes
  distDir: 'out', // Output directory for static files
  assetPrefix: '', // Ensure assets are served from root
  basePath: '', // Ensure no base path is set
  // Skip Firebase auth during static export
  experimental: {
    // This helps with Firebase auth issues during static export
    appDir: true,
  },
  // Ignore Firebase errors during build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
      };
    }
    return config;
  },
};

export default nextConfig;
