'use client';

import { usePubkyClientContext } from '@/contexts';
import { useRouter, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { getUserMuted, getUserProfile } from '@/services/userService';
import { defaultPreferences } from '@/contexts/_filters';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    pubky,
    storeProfile,
    profile,
    setMutedUsers,
    getTimestampNotification,
    setTimestamp,
    loadSettings,
    setNotificationPreferences,
    newUser,
    setNewUser,
    isSessionActive,
    logout,
  } = usePubkyClientContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const publicRoutes = [
    '/onboarding',
    '/onboarding/intro',
    '/onboarding/sign-in',
    '/onboarding/sign-up',
    '/logout',
    '/sign-in',
  ];

  const checkTimestamp = async () => {
    if (pubky === undefined) return;

    try {
      const result = await getTimestampNotification();
      setTimestamp(Number(result));
    } catch (error) {
      console.log(error);
    }
  };

  const checkSettings = async () => {
    if (pubky === undefined) return;

    try {
      const result = await loadSettings();
      if (result) {
        setNotificationPreferences(result.notifications);
      } else {
        setNotificationPreferences(defaultPreferences);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkMutedUsers = async () => {
    if (pubky === undefined) return;
    if (!profile) return;

    try {
      const mutedUsers = await getUserMuted(pubky);
      setMutedUsers(mutedUsers ?? []);
    } catch (error) {
      console.log(error);
      setMutedUsers([]);
    }
  };

  const checkProfileUser = async () => {
    if (pubky === undefined) return;

    let emptyProfile = profile ? false : true;

    if (emptyProfile) {
      try {
        const user = await getUserProfile(pubky, pubky);
        storeProfile(user.details);
        emptyProfile = false;
        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  };

  const checkAccess = async () => {
    const sessionActive = await isSessionActive();

    if (sessionActive) {
      const hasProfile = await checkProfileUser();

      if (!hasProfile) {
        if (pathname === '/sign-in' || pathname === '/onboarding/sign-up') {
          router.push('/onboarding/register');
          return;
        }
        if (
          publicRoutes.includes(pathname) ||
          pathname === '/onboarding/register' ||
          pathname === '/logout'
        ) {
          setLoading(false);
          return;
        } else {
          router.push('/onboarding/register');
          return;
        }
      }

      if (pathname === '/logout' || newUser) {
        setLoading(false);
        return;
      }

      // check if the user is trying to access a public route
      if (
        pathname === '/onboarding/register' ||
        publicRoutes.includes(pathname)
      ) {
        router.push('/home');
        return;
      }

      setLoading(false);
      setNewUser(false);
      return;
    }

    // check if the not logged user is trying to access a public route
    if (!publicRoutes.includes(pathname)) {
      if (pubky) logout();
      router.push('/onboarding');
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    checkMutedUsers();
    checkTimestamp();
    checkSettings();
  }, [pubky]);

  useEffect(() => {
    checkAccess();
  }, [pubky, pathname]);

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
    </>
  );
}
