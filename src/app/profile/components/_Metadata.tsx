'use client';

import { useEffect, useState } from 'react';
import { useFilterContext } from '@/contexts';

export function Metadata() {
  const { unReadNotification } = useFilterContext();
  const [localUnReadNotification, _] = useState(unReadNotification);

  useEffect(() => {
    document.title = `${localUnReadNotification ? `(🔔${localUnReadNotification})` : ''} Profile | Pubky.app`;
  }, []);

  return null;
}
