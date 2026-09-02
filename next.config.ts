import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    serverActions: {
      allowedOrigins: ['aiueo.mglwebkits.com', '*.mglwebkits.com', '127.0.0.1:3000', 'localhost:3000'],
      bodySizeLimit: '1mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    const legacy = ['about', 'services', 'events', 'gallery', 'news', 'contact', 'corporate-event', 'annual-kick-off', 'employee-gathering', 'family-gathering', 'outing-outbound', 'team-building', 'company-anniversary', 'custom-event-management'];
    return [
      { source: '/index.html', destination: '/id', permanent: true },
      ...legacy.map((slug) => ({ source: `/${slug}.html`, destination: `/id/${slug}`, permanent: true })),
    ];
  },
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "media-src 'self'",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      'upgrade-insecure-requests',
    ].join('; ');
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    }];
  },
};

export default nextConfig;
