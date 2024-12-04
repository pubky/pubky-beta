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

    try {
      const mutedUsers = await getUserMuted(pubky);
      setMutedUsers(mutedUsers ?? []);
    } catch (error) {
      setMutedUsers([]);
    }
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
        // Redirect to register if profile is empty
        setLoading(false);
        router.push('/onboarding/register');
        return false;
      }
    }

    return true;
  };

  const checkAccess = async () => {
    try {
      const loggedIn = await isLoggedIn();

      if (loggedIn) {
        const hasProfile = await checkProfileUser();

        if (hasProfile) {
          if (
            publicRoutes.includes(pathname) ||
            pathname === '/onboarding/register'
          ) {
            await checkMutedUsers();
            setLoading(false);
            router.push('/home');
            return;
          }
        } else {
          // Allow visiting only publicRoutes when profile is empty
          if (!publicRoutes.includes(pathname)) {
            setLoading(false);
            router.push('/onboarding/register');
            return;
          }
        }
      } else {
        // Redirect non-logged users trying to access restricted routes
        if (!publicRoutes.includes(pathname)) {
          setLoading(false);
          router.push('/onboarding');
          return;
        }
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
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
