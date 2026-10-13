'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

import type { PhotoWithSeries } from '../types/photo';

type PhotoGridProps = {
  photos: PhotoWithSeries[];
  onOpen: (id: string) => void;
  reducedMotion: boolean;
};

/** DUMB: grid foto bergaya masonry. Animasi hanya merespons perubahan filter. */
export function PhotoGrid({ photos, onOpen, reducedMotion }: PhotoGridProps) {
  return (
    <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
      <AnimatePresence mode="popLayout" initial={false}>
        {photos.map((photo) => (
          <motion.li
            key={photo.id}
            layout={!reducedMotion}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => onOpen(photo.id)}
              className="group block w-full text-left"
            >
              <span className="block overflow-hidden bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.025]"
                />
              </span>
              <span className="mt-2 flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium group-hover:text-grease">{photo.title}</span>
                <span className="shrink-0 text-muted-foreground">
                  {photo.place}, {photo.year}
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
