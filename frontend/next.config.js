// Purpose: Next.js Framework Configuration, API Proxy Rewrites & Runtime Settings
// Path: frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {   reactStrictMode: true,   swcMinify: true,
  // API Rewrites to proxy requests to backend service avoiding CORS in dev
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`
      }
    ];
  },
  // Security Headers Configuration
  async headers() {     return [
      {
        source: '/:path*',         headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',             value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',             value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  // Image Domain Optimization Config
  images: {
    domains: ['localhost', 'res.cloudinary.com', 's3.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',         hostname: '**'
      }
    ]
  }
}; module.exports = nextConfig;
