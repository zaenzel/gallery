'use client';

import { Image as DreiImage } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

/** Material milik drei <Image>: uniform bisa diubah langsung per frame. */
type ImageMaterial = THREE.ShaderMaterial & {
  opacity: number;
  grayscale: number;
  zoom: number;
};

export type SlideTarget = {
  position: [number, number, number];
  rotationZ: number;
  opacity: number;
  grayscale: number;
  scale: number;
};

type SlideProps = {
  url: string;
  /** lebar ÷ tinggi foto */
  aspect: number;
  /** tinggi slide dalam unit dunia */
  height: number;
  label: string;
  /** dipanggil tiap frame untuk menentukan posisi tujuan; slide bergerak halus ke sana */
  getTarget: (hovered: boolean, elapsed: number) => SlideTarget;
  onSelect?: () => void;
  /** dipanggil saat pointer turun; return false untuk membatalkan klik (mis. sedang drag) */
  shouldHandleClick?: () => boolean;
  /** kecepatan mengejar target, 0–1 per frame */
  damping?: number;
  /** render kedua sisi (untuk carousel, supaya slide di belakang tetap terlihat) */
  doubleSided?: boolean;
};

const MOUNT = 0.07;

/**
 * Satu "slide" foto: bingkai putih (mount), foto, dan bayangan tipis di meja cahaya.
 * Tidak tahu soal tata letak — posisinya ditentukan oleh `getTarget` dari parent.
 */
export function Slide({
  url,
  aspect,
  height,
  label,
  getTarget,
  onSelect,
  shouldHandleClick,
  damping = 0.12,
  doubleSided = false,
}: SlideProps) {
  const side = doubleSided ? THREE.DoubleSide : THREE.FrontSide;
  const group = useRef<THREE.Group>(null);
  const image = useRef<THREE.Mesh>(null);
  const mount = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const width = height * aspect;

  useFrame((state) => {
    const g = group.current;
    const img = image.current;
    if (!g || !img) return;

    const t = getTarget(hovered, state.clock.elapsedTime);
    const k = damping;

    g.position.x += (t.position[0] - g.position.x) * k;
    g.position.y += (t.position[1] - g.position.y) * k;
    g.position.z += (t.position[2] - g.position.z) * k;
    g.rotation.z += (t.rotationZ - g.rotation.z) * k;
    const s = g.scale.x + (t.scale - g.scale.x) * k;
    g.scale.setScalar(s);

    const m = img.material as ImageMaterial;
    m.opacity += (t.opacity - m.opacity) * k;
    m.grayscale += (t.grayscale - m.grayscale) * k;

    if (mount.current) {
      (mount.current.material as THREE.MeshBasicMaterial).opacity = m.opacity;
    }
    if (shadow.current) {
      (shadow.current.material as THREE.MeshBasicMaterial).opacity = m.opacity * 0.09;
      // semakin tinggi slide terangkat, semakin jauh bayangannya
      const lift = Math.max(0, g.position.z + 1.5) * 0.035;
      shadow.current.position.set(0.05 + lift, -0.07 - lift, -0.03);
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    if (onSelect) document.body.style.cursor = 'pointer';
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = '';
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (shouldHandleClick && !shouldHandleClick()) return;
    onSelect?.();
  };

  return (
    <group ref={group} scale={0.001}>
      <mesh ref={shadow} position={[0.05, -0.07, -0.03]}>
        <planeGeometry args={[width + MOUNT * 2, height + MOUNT * 2]} />
        <meshBasicMaterial
          color="#1b2228"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          side={side}
        />
      </mesh>
      <mesh ref={mount} position={[0, 0, -0.005]}>
        <planeGeometry args={[width + MOUNT * 2, height + MOUNT * 2]} />
        <meshBasicMaterial color="#f4f7f8" transparent opacity={0} toneMapped={false} side={side} />
      </mesh>
      <DreiImage
        ref={image}
        url={url}
        scale={[width, height]}
        transparent
        opacity={0}
        toneMapped={false}
        side={side}
        name={label}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      />
    </group>
  );
}
