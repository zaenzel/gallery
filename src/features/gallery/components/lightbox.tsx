'use client';

import { useLenis } from 'lenis/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { PhotoWithSeries } from '../types/photo';

type LightboxProps = {
  photos: PhotoWithSeries[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  reducedMotion: boolean;
};

/** Tampilan satu foto penuh. Esc untuk menutup, ← → untuk berpindah. */
export function Lightbox({ photos, index, onClose, onNavigate, reducedMotion }: LightboxProps) {
  const photo = photos[index];
  const closeButton = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const count = photos.length;

  const prev = () => onNavigate((index - 1 + count) % count);
  const next = () => onNavigate((index + 1) % count);

  // Pindahkan fokus ke tombol tutup, kembalikan ke elemen semula saat ditutup.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    return () => previouslyFocused?.focus({ preventScroll: true });
  }, []);

  // Kunci scroll halaman selama lightbox terbuka.
  useEffect(() => {
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.body.style.overflow = overflow;
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + count) % count);
      if (e.key === 'ArrowRight') onNavigate((index + 1) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, count, onClose, onNavigate]);

  if (!photo) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-50 flex flex-col bg-overlay text-overlay-foreground"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-display text-lg font-semibold tracking-wider text-film">
          ▸ {photo.frame}
          <span className="ml-3 font-sans text-sm font-normal tracking-normal text-overlay-foreground/60">
            {index + 1} dari {count}
          </span>
        </p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="p-2 text-overlay-foreground/80 transition-colors hover:text-overlay-foreground"
        >
          <X className="size-6" />
        </button>
      </div>

      <div className="relative flex-1" onClick={onClose}>
        <motion.div
          key={photo.id}
          className="absolute inset-x-4 inset-y-0 sm:inset-x-20"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-contain"
            onClick={(e) => e.stopPropagation()}
            priority
          />
        </motion.div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Foto sebelumnya"
          className="absolute top-1/2 left-1 -translate-y-1/2 p-3 text-overlay-foreground/70 transition-colors hover:text-overlay-foreground sm:left-4"
        >
          <ChevronLeft className="size-8" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Foto berikutnya"
          className="absolute top-1/2 right-1 -translate-y-1/2 p-3 text-overlay-foreground/70 transition-colors hover:text-overlay-foreground sm:right-4"
        >
          <ChevronRight className="size-8" />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-5 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
        <h2 className="font-display text-3xl leading-none font-bold sm:text-4xl">{photo.title}</h2>
        <p className="flex gap-4 text-sm text-overlay-foreground/70">
          <span>Seri {photo.series.title}</span>
          <span>
            {photo.place}, {photo.year}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
