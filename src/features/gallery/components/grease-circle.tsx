'use client';

import { motion } from 'motion/react';

type GreaseCircleProps = {
  /** variasi bentuk supaya tiap lingkaran terlihat digambar tangan */
  variant?: 0 | 1 | 2;
  animate?: boolean;
  delay?: number;
  className?: string;
};

// Tiga coretan elips yang sedikit tidak rapi dan tidak menutup sempurna.
const PATHS = [
  'M52 6 C 82 4, 98 22, 96 48 C 94 78, 70 96, 44 94 C 16 92, 2 72, 4 46 C 6 22, 26 6, 58 9',
  'M46 5 C 76 2, 97 20, 97 50 C 97 80, 74 97, 46 95 C 18 93, 3 74, 3 48 C 3 20, 24 4, 54 7',
  'M55 4 C 84 6, 99 28, 95 54 C 91 82, 66 97, 40 93 C 13 89, 0 66, 5 40 C 10 16, 32 3, 62 8',
] as const;

/** Lingkaran pensil grease merah — penanda frame pilihan di contact sheet. */
export function GreaseCircle({
  variant = 0,
  animate = true,
  delay = 0,
  className,
}: GreaseCircleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
      <motion.path
        d={PATHS[variant]}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={animate ? { pathLength: 0 } : false}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
