import { type RefObject, useEffect, useState } from 'react';

/**
 * `true` selama elemen terlihat di viewport (plus margin).
 * Dipakai untuk menghentikan render 3D yang sedang tidak terlihat.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = '200px') {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      rootMargin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
