'use client';

import { usePubkyClientContext } from '@/contexts';
import { useRouter, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { getUserProfile } from '@/services/userService';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, pubky, profile, storeProfile } = usePubkyClientContext();
  const [showModal, setShowModal] = useState(false);
  const [showServerDown, setShowServerDown] = useState(false);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
        return;
      }

      if (loggedIn && pubky && !profile) {
        try {
          const user = await getUserProfile(pubky, pubky);
          console.log('user', user);
          storeProfile(user.details);
        } catch (error) {
          console.error('Error getting profile', error);
        }
      }

      if (!loggedIn && isProtected) {
        router.push('/onboarding');
        setLoading(false);
        return;
      }
      if (loggedIn && redirectLoggedUser.includes(pathname)) {
        router.push('/home');
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router, pathname]);

  return (
    <>
      <div className="z-index-999">
        <NextTopLoader color="white" />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
        </div>
      ) : (
        children
      )}
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
