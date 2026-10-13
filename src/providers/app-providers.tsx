'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { getQueryClient } from '@/lib/query-client';

import 'lenis/dist/lenis.css';

/** Semua provider global dibungkus di sini supaya `app/layout.tsx` tetap bersih. */
export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <QueryClientProvider client={queryClient}>
      {reducedMotion ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
          {children}
        </ReactLenis>
      )}
    </QueryClientProvider>
  );
}
