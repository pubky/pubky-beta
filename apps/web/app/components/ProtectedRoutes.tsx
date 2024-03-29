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
  const { isLoggedIn } = useClientContext();

  useEffect(() => {
    const protectedRoutes = [
      '/contacts',
      '/followers',
      '/home',
      '/hot-tags',
      '/notifications',
      '/post',
      '/profile',
      '/search',
      '/settings',
    ];

    const redirectLoggedUser = ['/onboarding', '/login', '/sign-up'];

    const notRedirectUser = [
      '/onboarding/welcome',
      '/onboarding/permissions',
      '/onboarding/confirm',
      '/onboarding/sign-up',
    ];

    const isProtected = protectedRoutes.includes(pathname);

    const checkLogin = async () => {
      const loggedIn = await isLoggedIn();

      console.log(pathname, loggedIn, isProtected);

      // exceptions for the onboarding process
      if (notRedirectUser.includes(pathname)) {
        return;
      }

      if (!loggedIn && isProtected) {
        router.push('/onboarding');
        return;
      }
      if (loggedIn && redirectLoggedUser.includes(pathname)) {
        router.push('/home');
        return;
      }
    };

    checkLogin();
  }, [isLoggedIn, router, pathname]);

  return <>{children}</>;
}
