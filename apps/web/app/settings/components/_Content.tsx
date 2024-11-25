'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    router.replace('/settings/account');
  }, [searchParams, router]);

  return <></>;
}
