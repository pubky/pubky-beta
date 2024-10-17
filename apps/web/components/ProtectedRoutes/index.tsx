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
  const { isLoggedIn, pubky, storeProfile, profile } = usePubkyClientContext();
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

  const redirectLoggedUser = [
    '/onboarding',
    '/login',
    '/sign-up',
    '/sign-in',
    '/onboarding/welcome',
    '/onboarding/permissions',
  ];

  useEffect(() => {
    const checkLogin = async () => {
      const pk = pubky || '';

      const loggedIn = await isLoggedIn();
      let emptyProfile = profile ? false : true;

      // check if user is logged in
      if (loggedIn) {
        // check if user has a profile
        if (emptyProfile) {
          try {
            const user = await getUserProfile(pk, pk);
            storeProfile(user.details);
            emptyProfile = false;
          } catch (error) {
            // if there is no profile, redirect to register a new one
            router.push('/onboarding/register');
            setLoading(false);
            return;
          }
        }

        if (redirectLoggedUser.includes(pathname)) {
          router.push('/home');
          setLoading(false);
          return;
        }
      } else {
        if (protectedRoutes.includes(pathname)) {
          router.push('/onboarding');
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    };

    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, router, pathname]);

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
