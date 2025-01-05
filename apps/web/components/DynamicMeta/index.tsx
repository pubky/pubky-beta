'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const DynamicMeta = () => {
  const pathname = usePathname();

  useEffect(() => {
    const applyViewportMeta = () => {
      let metaTag = document.querySelector(
        'meta[name="viewport"]',
      ) as HTMLMetaElement | null;
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content =
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        document.head.appendChild(metaTag);
      } else {
        metaTag.content =
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      }
    };

    applyViewportMeta();
  }, [pathname]);

  return null;
};

export default DynamicMeta;
