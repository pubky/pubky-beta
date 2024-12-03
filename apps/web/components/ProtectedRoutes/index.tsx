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
    isLoggedIn,
    pubky,
    storeProfile,
    profile,
    setMutedUsers,
    getTimestampNotification,
    setTimestamp,
    loadSettings,
    setNotificationPreferences,
  } = usePubkyClientContext();
  const [showModal, setShowModal] = useState(false);
  const [showServerDown, setShowServerDown] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const protectedRoutes = [
    '/followers',
    '/home',
    '/hot',
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

  const checkTimestamp = async () => {
    if (pubky === undefined) return;

    const result = await getTimestampNotification();
    setTimestamp(Number(result));
  };

  const checkSettings = async () => {
    if (pubky === undefined) return;

    const result = await loadSettings();
    if (result) {
      setNotificationPreferences(result.notifications);
    } else {
      setNotificationPreferences(defaultPreferences);
    }
  };

  const checkMutedUsers = async () => {
    if (pubky === undefined) return;

    const mutedUsers = await getUserMuted(pubky);
    setMutedUsers(mutedUsers);
  };

  const checkProfileUser = async () => {
    if (pubky === undefined) return;

    let emptyProfile = profile ? false : true;

    if (emptyProfile) {
      try {
        const pk = pubky || '';
        const user = await getUserProfile(pk, pk);
        storeProfile(user.details);
        emptyProfile = false;
        return true;
      } catch (error) {
        // if there is no profile, redirect to register a new one
        router.push('/onboarding/register');
        setLoading(false);
        return;
      }
    }
  };

  const checkLogin = async () => {
    try {
      const loggedIn = await isLoggedIn();

      if (loggedIn) {
        const result = await checkProfileUser();

        if (result && redirectLoggedUser.includes(pathname)) {
          router.push('/home');
          setLoading(false);
          await checkMutedUsers();
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
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
    checkTimestamp();
    checkSettings();
  }, [pubky]);

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
