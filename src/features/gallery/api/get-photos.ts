import { photosData, seriesData } from '@/mocks/photos';

import type { PhotoWithSeries, Series } from '../types/photo';

/**
 * Sumber data galeri. Saat ini membaca data dummy lokal.
 * Untuk pindah ke CMS/backend, cukup ubah isi fungsi-fungsi ini —
 * komponen dan halaman tidak perlu disentuh.
 *
 * Konten galeri bersifat statis, jadi diambil di Server Component
 * (tanpa TanStack Query) dan halaman bisa di-prerender.
 */
export async function getSeries(): Promise<Series[]> {
  return seriesData;
}

export async function getPhotos(): Promise<PhotoWithSeries[]> {
  const series = await getSeries();
  const bySlug = new Map(series.map((s) => [s.slug, s]));

  return photosData.flatMap((photo) => {
    const s = bySlug.get(photo.seriesSlug);
    return s ? [{ ...photo, series: s }] : [];
  });
}

/** Frame-frame pertama untuk contact sheet di beranda. */
export async function getContactSheet(limit = 9): Promise<PhotoWithSeries[]> {
  const photos = await getPhotos();
  return photos.slice(0, limit);
}
