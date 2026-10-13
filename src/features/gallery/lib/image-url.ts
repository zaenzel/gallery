/**
 * URL gambar teroptimasi dari image optimizer Next.js (`/_next/image`).
 * Dipakai untuk tekstur 3D: ukurannya kecil (WebP), dan karena same-origin
 * tidak ada masalah CORS di WebGL.
 *
 * `width` harus salah satu dari deviceSizes/imageSizes Next (default: 640, 750, 828, 1080, …)
 * dan `quality` harus ada di `images.qualities` (default: [75]).
 */
export function optimizedImageUrl(src: string, width: 640 | 750 | 828 | 1080 = 640) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
