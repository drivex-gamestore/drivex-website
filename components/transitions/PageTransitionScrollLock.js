"use client";

import { useEffect } from 'react';
import { useLenis } from '@modules/providers/LenisProvider';
import { usePageTransition } from '@hooks/usePageTransition';

export function PageTransitionScrollLock() {
  const lenis = useLenis();
  const { phase } = usePageTransition();

  useEffect(() => {
    if (lenis) {
      if (phase === "entering" || phase === "holding" || phase === "exiting") {
        lenis.stop();
      } else if (phase === "idle") {
        lenis.start();
      }
    }
  }, [lenis, phase]);
  return null;
}
