'use client';

import { usePubkyClientContext } from '@/contexts';
import { useRouter, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { getUserMuted, getUserProfile } from '@/services/userService';
import { defaultPreferences } from '@/contexts/_filters';
import { Utils } from '@social/utils-shared';
import { PubkyAppUser } from 'pubky-app-specs';
import { BottomSheet } from '../BottomSheet';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [loading, setLoading] = useState(true);

  const publicRoutes = [
    '/onboarding',
    '/onboarding/intro',
    '/onboarding/sign-in',
    '/onboarding/sign-up',
    '/logout',
    '/sign-in',
    '/invite-code',
  ];

  const isDynamicPublicRoute = (path: string) => {
    const dynamicPublicRoutes = [
      '/post/[userId]/[postId]',
      '/profile/[userId]',
    ];
    return dynamicPublicRoutes.some((route) =>
      new RegExp(
        `^${route.replace(/\[.*?\]/g, '[^/]+').replace(/\//g, '\\/')}$`,
      ).test(path),
    );
  };

  const checkTimestamp = async () => {
    if (pubky === undefined) return;

    try {
      const result = await getTimestampNotification();
      if (result > 0) {
        setTimestamp(Number(result));
      }
    } catch (error) {
      console.debug('No last_read data available for new user');
    }
  };

  const checkSettings = async () => {
    if (pubky === undefined) return;

    try {
      const result = await loadSettings();
      if (result?.notifications) {
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
        const userDetails = (await getUserProfile(pubky, pubky)).details;
        const user = {
          name: userDetails.name,
          bio: userDetails.bio,
          image: userDetails.image,
          links: userDetails.links,
          status: userDetails.status,
        } as PubkyAppUser;
        storeProfile(user);
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

      // Check if the user is trying to access a public route
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

    if (pubky) logout();

    // Check if the not logged user is trying to access a public route
    if (!publicRoutes.includes(pathname) && !isDynamicPublicRoute(pathname)) {
      setShowModal(true);
      setShowBottomSheet(true);
      router.push('/onboarding');
      setTimeout(() => {
        setShowModal(false);
        setShowBottomSheet(false);
      }, 2000);
      return;
    }

    // Check invite code
    const inviteCode = Utils.storage.get('inviteCode');

    if (
      ['/sign-in', '/onboarding/sign-in', '/onboarding/sign-up'].includes(
        pathname,
      ) &&
      !inviteCode
    ) {
      router.push('/invite-code');
      return;
    }

    if (inviteCode) {
      try {
        const response = await fetch('/api/invite-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode }),
        });
        const data = await response.json();

        if (!data.valid) {
          router.push('/invite-code');
          return;
        }

        if (pathname === '/invite-code') {
          router.push('/onboarding/sign-in');
          return;
        }
      } catch (error) {
        console.error('Error verifying invitation code:', error);
        router.push('/invite-code');
        return;
      }
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
      {isMobile
        ? showBottomSheet && (
            <BottomSheet.SessionExpired
              setShow={setShowBottomSheet}
              show={showBottomSheet}
            />
          )
        : showModal && (
            <Modal.SessionExpired
              setShowModal={setShowModal}
              showModal={showModal}
            />
          )}
    </>
  );
}
