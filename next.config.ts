import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/core/api/:path*',
        destination: 'http://192.168.1.222:8082/core/api/:path*',
      },
      {
        source: '/auth/api/:path*',
        destination: 'http://192.168.1.222:8082/auth/api/:path*',
      },
      {
        source: '/message/api/v1/:path*',
        destination: 'http://192.168.1.222:8082/message/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
