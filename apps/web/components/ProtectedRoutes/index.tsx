/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useClientContext } from '@/contexts';
import { useRouter, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, session, setSearchTags } = useClientContext();
  const [showModal, setShowModal] = useState(false);
  const [showServerDown, setShowServerDown] = useState(false);
  const protectedRoutes = [
    '/followers',
    '/home',
    '/hot-tags',
    '/notifications',
    '/post',
    '/profile',
    '/search',
    '/settings',
  ];

  const redirectLoggedUser = ['/onboarding', '/login', '/sign-up', '/sign-in'];

  const notRedirectUser = [
    '/onboarding/welcome',
    '/onboarding/permissions',
    '/onboarding/confirm',
    '/onboarding/sign-up',
  ];

  useEffect(() => {
    const isProtected = protectedRoutes.includes(pathname);

    const checkLogin = async () => {
      const loggedIn = await isLoggedIn();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router, pathname]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn: any = await session();
      const isProtected = protectedRoutes.includes(pathname);

      if (
        isProtected &&
        loggedIn &&
        typeof loggedIn === 'object' &&
        'users' in loggedIn
      ) {
        if (Object.keys(loggedIn.users).length > 0) {
          setShowModal(false);
        } else {
          router.push('/sign-in');
          //setShowModal(true);
        }
      } else if (loggedIn === false) {
        setShowServerDown(true);
      }
    };

    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pathname]);

  useEffect(() => {
    if (pathname !== '/search') {
      setSearchTags([]);
    }
  }, [pathname, setSearchTags]);

  return (
    <>
      <div className="z-index-999">
        <NextTopLoader color="white" />
      </div>
      {children}
      {showModal && (
        <Modal.SessionExpired
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      {showServerDown && (
        <Modal.ServerDown
          setShowModal={setShowServerDown}
          showModal={showServerDown}
        />
      )}
    </>
  );
}
