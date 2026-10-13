'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useRef } from 'react';

import { useInView } from '@/hooks/use-in-view';
import type * as THREE from 'three';

import { Slide, type SlideTarget } from './slide';

export type HeroSlide = {
  id: string;
  url: string;
  aspect: number;
  title: string;
};

type HeroSceneProps = {
  slides: HeroSlide[];
  reducedMotion: boolean;
  onSelect: (id: string) => void;
};

/**
 * Tata letak slide di atas meja: [x, y, z, rotasiZ].
 * Sengaja tidak simetris — seperti slide yang dijatuhkan begitu saja.
 */
const LAYOUT: [number, number, number, number][] = [
  [-3.2, 1.25, -0.8, 0.13],
  [-1.35, 1.55, 0.1, -0.09],
  [0.7, 1.2, -1.2, 0.2],
  [2.85, 1.4, 0.0, -0.16],
  [-2.1, 0.1, 0.4, -0.22],
  [0.1, -0.05, 0.75, 0.07],
  [2.0, -0.3, -0.5, 0.24],
  [3.6, -0.9, -1.1, -0.06],
];

/** Versi layar potret/sempit: kolom vertikal di antara teks pengantar dan nama. */
const LAYOUT_NARROW: [number, number, number, number][] = [
  [-0.5, 0.85, -0.3, 0.12],
  [0.5, 1.0, 0.1, -0.1],
  [-0.45, 0.0, 0.4, -0.18],
  [0.55, -0.1, -0.4, 0.2],
  [-0.4, -0.85, 0.2, 0.08],
  [0.55, -0.95, 0.5, -0.14],
];

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

function Table({ slides, reducedMotion, onSelect }: HeroSceneProps) {
  const tilt = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const viewportWidth = useThree((s) => s.viewport.width);
  const pixelWidth = useThree((s) => s.size.width);

  // Layar sempit memakai tata letak tersendiri; layar lebar merenggangkan sebaran sesuai lebar.
  const narrow = pixelWidth < 640;
  const layout = narrow ? LAYOUT_NARROW : LAYOUT;
  const spread = narrow ? 1 : Math.min(1.15, Math.max(0.6, viewportWidth / 7.8));
  const slideHeight = narrow ? 0.6 : 0.88;

  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const g = tilt.current;
    if (!g || reducedMotion) return;
    // seluruh meja sedikit miring mengikuti kursor
    g.rotation.y += (state.pointer.x * 0.22 - g.rotation.y) * 0.05;
    g.rotation.x += (-state.pointer.y * 0.14 - g.rotation.x) * 0.05;
  });

  const targetFor = useCallback(
    (index: number) =>
      (hovered: boolean, elapsed: number): SlideTarget => {
        const [x, y, z, rz] = layout[index % layout.length]!;
        const base: [number, number, number] = [x * spread, y, z];

        if (reducedMotion) {
          return {
            position: [base[0], base[1], base[2] + (hovered ? 0.4 : 0)],
            rotationZ: hovered ? 0 : rz,
            opacity: 1,
            grayscale: 0,
            scale: 1,
          };
        }

        // Satu momen pembuka: slide jatuh ke meja satu per satu.
        const t0 = start.current ?? elapsed;
        const p = easeOutCubic(
          Math.min(1, Math.max(0, (elapsed - t0 - 0.25 - index * 0.12) / 1.1)),
        );
        const drift = Math.sin(elapsed * 0.6 + index * 1.7) * 0.04;

        return {
          position: [
            base[0],
            base[1] + drift + (1 - p) * 0.6,
            base[2] + (1 - p) * 4 + (hovered ? 0.45 : 0),
          ],
          rotationZ: hovered ? 0 : rz + (1 - p) * 0.5,
          opacity: p,
          grayscale: hovered ? 0 : 0.25,
          scale: hovered ? 1.06 : 1,
        };
      },
    [layout, spread, reducedMotion],
  );

  return (
    <group ref={tilt}>
      {slides.slice(0, layout.length).map((slide, i) => (
        <Slide
          key={slide.id}
          url={slide.url}
          aspect={slide.aspect}
          height={slideHeight}
          label={slide.title}
          getTarget={targetFor(i)}
          damping={reducedMotion ? 1 : 0.12}
          onSelect={() => onSelect(slide.id)}
        />
      ))}
    </group>
  );
}

/** Scene 3D beranda: slide foto berserakan di meja cahaya. Di-load lewat dynamic import. */
export function HeroScene(props: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  // Halaman berisi dua scene 3D: yang tidak terlihat berhenti merender.
  const inView = useInView(wrapper);

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 35 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        aria-label="Slide-slide foto di atas meja cahaya. Klik salah satu untuk membukanya."
        fallback={null}
      >
        <Suspense fallback={null}>
          <Table {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
