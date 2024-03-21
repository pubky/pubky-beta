'use client';

import { useClientContext } from '../../contexts/client';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, pubkey } = useClientContext();

  useEffect(() => {
    const notProtectedRoutes = [
      '/onboarding',
      '/onboarding/sign-up',
      '/onboarding/sign-in',
      '/onboarding/confirm',
      '/onboarding/permissions',
    ];

    const checkLogin = async () => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn && !pubkey && !notProtectedRoutes.includes(pathname)) {
        router.push('/onboarding');
      } else if (pubkey && notProtectedRoutes.includes(pathname)) {
        router.push('/home');
      }
    };

    checkLogin();
  }, [isLoggedIn, router, pathname, pubkey]);

  return <>{children}</>;
}
