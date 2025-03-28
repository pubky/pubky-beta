'use client';

import { useEffect } from 'react';
import { useFilterContext } from '@/contexts';
import { usePathname } from 'next/navigation';

export function DynamicTitle() {
  const pathname = usePathname();
  const { unReadNotification } = useFilterContext();

  useEffect(() => {
    const updateTitle = () => {
      const originalTitle = document.title;
      const baseTitle = originalTitle.replace(/^\(\d+\)\s*/, '');

      const notificationPrefix = unReadNotification ? `(${unReadNotification}) ` : '';
      document.title = `${notificationPrefix}${baseTitle}`;
    };

    updateTitle();
    window.addEventListener('visibilitychange', updateTitle);
    return () => window.removeEventListener('visibilitychange', updateTitle);
  }, [unReadNotification, pathname]);

  return null;
}
