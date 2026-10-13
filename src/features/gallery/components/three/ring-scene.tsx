'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  type KeyboardEvent,
  type RefObject,
  Suspense,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type * as THREE from 'three';

import { useInView } from '@/hooks/use-in-view';

import { Slide, type SlideTarget } from './slide';

export type RingSlide = {
  id: string;
  url: string;
  aspect: number;
  title: string;
};

type RingSceneProps = {
  slides: RingSlide[];
  reducedMotion: boolean;
  onSelect: (id: string) => void;
};

const DRAG_SPEED = 0.006;
const AUTO_SPIN = 0.06; // radian per detik

/** Status putaran dibagikan lewat ref supaya tidak memicu re-render tiap frame. */
type Spin = {
  angle: number;
  target: number;
  velocity: number;
  dragging: boolean;
  lastX: number;
  moved: number;
};

function Ring({
  slides,
  reducedMotion,
  onSelect,
  spinRef,
}: RingSceneProps & { spinRef: RefObject<Spin> }) {
  const group = useRef<THREE.Group>(null);
  const viewportWidth = useThree((s) => s.viewport.width);
  const count = slides.length;
  const slideHeight = viewportWidth < 5 ? 0.9 : 1.15;
  // radius menyesuaikan jumlah foto supaya jaraknya tetap lega
  const radius = Math.max(2.2, (count * slideHeight * 1.25) / (2 * Math.PI));

  useFrame((_, delta) => {
    const spin = spinRef.current;
    if (!spin.dragging) {
      // momentum setelah drag dilepas, lalu kembali ke putaran pelan
      spin.target += spin.velocity;
      spin.velocity *= 0.94;
      if (!reducedMotion) spin.target += AUTO_SPIN * delta;
    }
    spin.angle += (spin.target - spin.angle) * (reducedMotion ? 1 : 0.08);
    if (group.current) group.current.rotation.y = spin.angle;
  });

  const targetFor = useCallback(
    (index: number) =>
      (hovered: boolean, elapsed: number): SlideTarget => {
        const a = (index / count) * Math.PI * 2;
        // seberapa menghadap kamera slide ini (1 = paling depan, -1 = paling belakang)
        const facing = Math.cos(a + spinRef.current.angle);
        const front = (facing + 1) / 2;
        const bob = reducedMotion ? 0 : Math.sin(elapsed * 0.8 + index) * 0.05;

        // posisi lokal: grup induk sudah diputar sebesar `a`, jadi slide cukup didorong ke radius
        return {
          position: [0, bob + (index % 2 === 0 ? 0.12 : -0.12), radius],
          rotationZ: 0,
          opacity: 0.25 + front * 0.75,
          // foto di belakang memudar ke hitam-putih
          grayscale: hovered ? 0 : 1 - front,
          scale: hovered ? 1.08 : 1,
        };
      },
    [count, radius, reducedMotion, spinRef],
  );

  return (
    <group ref={group}>
      {slides.map((slide, i) => (
        <group key={slide.id} rotation={[0, (i / count) * Math.PI * 2, 0]}>
          <Slide
            url={slide.url}
            aspect={slide.aspect}
            height={slideHeight}
            label={slide.title}
            getTarget={targetFor(i)}
            damping={0.15}
            doubleSided
            onSelect={() => onSelect(slide.id)}
            shouldHandleClick={() => spinRef.current.moved < 6}
          />
        </group>
      ))}
    </group>
  );
}

/** Carousel 3D melingkar. Tarik ke kiri/kanan untuk memutar, klik foto untuk membuka. */
export function RingScene(props: RingSceneProps) {
  const spinRef = useRef<Spin>({
    angle: 0,
    target: 0,
    velocity: 0,
    dragging: false,
    lastX: 0,
    moved: 0,
  });
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper);

  useEffect(() => {
    const el = wrapper.current;
    const spin = spinRef.current;
    if (!el) return;

    const down = (e: PointerEvent) => {
      spin.dragging = true;
      spin.lastX = e.clientX;
      spin.moved = 0;
      spin.velocity = 0;
    };
    const move = (e: PointerEvent) => {
      if (!spin.dragging) return;
      const dx = e.clientX - spin.lastX;
      spin.lastX = e.clientX;
      spin.moved += Math.abs(dx);
      spin.target += dx * DRAG_SPEED;
      spin.velocity = dx * DRAG_SPEED * 0.6;
    };
    const up = () => {
      spin.dragging = false;
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  // Keyboard: panah kiri/kanan memutar carousel saat area ini difokus.
  const onKeyDown = (e: KeyboardEvent) => {
    const step = (Math.PI * 2) / Math.max(1, props.slides.length);
    if (e.key === 'ArrowLeft') spinRef.current.target += step;
    if (e.key === 'ArrowRight') spinRef.current.target -= step;
  };

  return (
    <div
      ref={wrapper}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel foto 3D. Tarik atau gunakan tombol panah untuk memutar."
      onKeyDown={onKeyDown}
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 2.4, 9.5], fov: 36 }}
        onCreated={({ camera }) => camera.lookAt(0, -0.9, 0)}
        dpr={[1, 1.75]}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <Ring {...props} spinRef={spinRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
