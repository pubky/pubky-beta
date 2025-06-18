'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ViewportHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // iOS PWA detection
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isiOSPWA = isIOS && isStandalone;

    // Only run on iOS PWA
    if (isiOSPWA) {
      // Prevent infinite reload loop
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      if (!win.__clearedCaches) {
        win.__clearedCaches = true;
        // Clear all caches
        if ('caches' in window) {
          caches
            .keys()
            .then((names) => {
              return Promise.all(names.map((name) => caches.delete(name)));
            })
            .catch(() => {});
        }

        // Force reload after a short delay to allow cache clearing
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    const disableZoom = () => {
      const metaTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!metaTag) return;

      // Disable zoom
      metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    };

    // Disable zoom on initial load
    if (document.readyState === 'complete') {
      disableZoom();
    } else {
      window.addEventListener('load', disableZoom);
    }

    // Disable zoom on route change
    disableZoom();

    // Cleanup
    return () => {
      window.removeEventListener('load', disableZoom);
    };
  }, [pathname]); // Re-run effect when pathname changes

  return null;
}
