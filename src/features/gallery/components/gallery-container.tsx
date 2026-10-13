'use client';

import { AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

import { optimizedImageUrl } from '../lib/image-url';
import type { PhotoWithSeries, Series } from '../types/photo';
import { Lightbox } from './lightbox';
import { PhotoGrid } from './photo-grid';
import { SeriesFilter } from './series-filter';

const RingScene = dynamic(() => import('./three/ring-scene').then((m) => m.RingScene), {
  ssr: false,
  loading: () => null,
});

type GalleryContainerProps = {
  photos: PhotoWithSeries[];
  series: Series[];
};

/**
 * SMART: menyimpan filter seri (`?seri=`) dan foto yang dibuka (`?foto=`) di URL,
 * supaya keduanya bisa dibagikan lewat link dan tombol back browser bekerja.
 */
export function GalleryContainer({ photos, series }: GalleryContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();

  const activeSeries = searchParams.get('seri') ?? undefined;
  const openId = searchParams.get('foto');

  const filtered = useMemo(
    () => (activeSeries ? photos.filter((p) => p.seriesSlug === activeSeries) : photos),
    [photos, activeSeries],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of photos) c[p.seriesSlug] = (c[p.seriesSlug] ?? 0) + 1;
    return c;
  }, [photos]);

  const ringSlides = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.id,
        url: optimizedImageUrl(p.src),
        aspect: p.width / p.height,
        title: p.title,
      })),
    [filtered],
  );

  const setParams = useCallback(
    (changes: Record<string, string | undefined>, mode: 'push' | 'replace' = 'push') => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      const qs = next.toString();
      router[mode](qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Lightbox menelusuri foto sesuai filter aktif; jika foto yang dibuka di luar filter, pakai semua.
  const lightboxPhotos = filtered.some((p) => p.id === openId) ? filtered : photos;
  const openIndex = openId ? lightboxPhotos.findIndex((p) => p.id === openId) : -1;

  const open = (id: string) => setParams({ foto: id });
  const close = useCallback(() => setParams({ foto: undefined }), [setParams]);
  const navigate = useCallback(
    (index: number) => {
      const target = lightboxPhotos[index];
      if (target) setParams({ foto: target.id }, 'replace');
    },
    [lightboxPhotos, setParams],
  );

  return (
    <>
      <div className="relative -mx-5 h-[62svh] min-h-[22rem] sm:-mx-8">
        <RingScene slides={ringSlides} reducedMotion={reducedMotion} onSelect={open} />
        <p className="pointer-events-none absolute right-5 bottom-2 text-sm text-muted-foreground sm:right-8">
          Tarik untuk memutar, klik foto untuk membuka
        </p>
      </div>

      <div className="mt-14 mb-10 sm:mt-20 sm:mb-14">
        <SeriesFilter
          series={series}
          counts={counts}
          total={photos.length}
          active={activeSeries}
          onChange={(slug) => setParams({ seri: slug, foto: undefined }, 'replace')}
        />
        {activeSeries ? (
          <p className="mt-6 max-w-md text-muted-foreground">
            {series.find((s) => s.slug === activeSeries)?.description}
          </p>
        ) : null}
      </div>

      <PhotoGrid photos={filtered} onOpen={open} reducedMotion={reducedMotion} />

      <AnimatePresence>
        {openIndex >= 0 ? (
          <Lightbox
            key="lightbox"
            photos={lightboxPhotos}
            index={openIndex}
            onClose={close}
            onNavigate={navigate}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
