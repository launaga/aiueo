import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
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
};

export default nextConfig;
