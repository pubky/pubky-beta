'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ViewportHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const disableZoom = () => {
      const metaTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!metaTag) return;

      // Disable zoom
      metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    };

    // iOS-specific gesture prevention
    const preventGestures = (e: Event) => {
      e.preventDefault();
    };

    const preventTouchMove = (e: TouchEvent) => {
      // Prevent zoom via multi-touch
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Disable zoom on initial load
    if (document.readyState === 'complete') {
      disableZoom();
    } else {
      window.addEventListener('load', disableZoom);
    }

    // Disable zoom on route change
    disableZoom();

    // Add iOS gesture prevention
    document.addEventListener('gesturestart', preventGestures, { passive: false });
    document.addEventListener('gesturechange', preventGestures, { passive: false });
    document.addEventListener('gestureend', preventGestures, { passive: false });

    // Additional touch event prevention for multi-touch zoom
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener('load', disableZoom);
      document.removeEventListener('gesturestart', preventGestures);
      document.removeEventListener('gesturechange', preventGestures);
      document.removeEventListener('gestureend', preventGestures);
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [pathname]); // Re-run effect when pathname changes

  return null;
}
