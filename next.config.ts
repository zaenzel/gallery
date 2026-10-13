import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Foto dummy dari Picsum. picsum.photos me-redirect ke fastly.picsum.photos,
    // jadi keduanya harus diizinkan. Hapus/ganti saat foto asli sudah tersedia.
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
    ],
    maximumRedirects: 3,
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
