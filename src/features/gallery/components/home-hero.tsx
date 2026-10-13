'use client';

import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

import { optimizedImageUrl } from '../lib/image-url';
import type { PhotoWithSeries } from '../types/photo';
import type { HeroSlide } from './three/hero-scene';

// Three.js berat (~150KB gz): dimuat terpisah, hanya di browser, setelah halaman tampil.
const HeroScene = dynamic(() => import('./three/hero-scene').then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

type HomeHeroProps = {
  ownerName: string;
  photos: PhotoWithSeries[];
  photoCount: number;
  seriesCount: number;
};

export function HomeHero({ ownerName, photos, photoCount, seriesCount }: HomeHeroProps) {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();

  const slides: HeroSlide[] = photos.map((p) => ({
    id: p.id,
    url: optimizedImageUrl(p.src),
    aspect: p.width / p.height,
    title: p.title,
  }));

  return (
    <section className="relative isolate h-svh min-h-[34rem] overflow-hidden">
      {/* Nama raksasa duduk DI BAWAH slide: slide melayang di atasnya */}
      <motion.h1
        className="absolute -bottom-[0.12em] left-[-0.04em] z-0 font-display text-display leading-[0.8] font-black tracking-[-0.02em] text-foreground select-none"
        initial={reducedMotion ? false : { y: '35%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {ownerName}
      </motion.h1>

      <div className="absolute inset-0 z-10">
        <HeroScene
          slides={slides}
          reducedMotion={reducedMotion}
          onSelect={(id) => router.push(`/?foto=${id}`, { scroll: false })}
        />
      </div>

      {/* Mobile: di atas, di bawah header. Desktop: pojok kanan bawah. */}
      <div className="pointer-events-none absolute inset-x-5 top-16 z-20 sm:inset-x-auto sm:top-auto sm:right-8 sm:bottom-12 sm:max-w-[19rem]">
        <motion.div
          className="pointer-events-auto flex flex-col gap-3 sm:gap-4"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <p className="text-[0.95rem] leading-relaxed text-pretty sm:text-base">
            Foto-foto yang aku ambil sambil berjalan pelan. {photoCount} frame dari {seriesCount}{' '}
            seri, sudah keluar dari laci dan siap dilihat.
          </p>
          <a
            href="#galeri"
            className="self-start border-b-2 border-foreground pb-0.5 text-sm font-semibold transition-colors hover:border-grease hover:text-grease"
          >
            Lihat semua foto
          </a>
        </motion.div>
      </div>
    </section>
  );
}
