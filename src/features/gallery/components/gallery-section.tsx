import { Suspense } from 'react';

import type { PhotoWithSeries, Series } from '../types/photo';
import { GalleryContainer } from './gallery-container';

type GallerySectionProps = {
  photos: PhotoWithSeries[];
  series: Series[];
};

/** Bagian galeri di halaman utama: judul + carousel 3D, filter, grid, lightbox. */
export function GallerySection({ photos, series }: GallerySectionProps) {
  return (
    <section
      id="galeri"
      aria-labelledby="galeri-judul"
      className="mt-32 scroll-mt-16 px-5 pt-6 sm:mt-48 sm:px-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="galeri-judul" className="font-display text-headline leading-[0.82] font-black">
          Galeri
        </h2>
        <p className="pb-2 text-muted-foreground">
          {photos.length} foto dalam {series.length} seri
        </p>
      </div>

      {/* useSearchParams di dalam container butuh batas Suspense */}
      <Suspense fallback={<div className="h-[62svh] min-h-[22rem]" />}>
        <GalleryContainer photos={photos} series={series} />
      </Suspense>
    </section>
  );
}
