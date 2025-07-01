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
