'use client';

import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import { useRouter, usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import React, { useEffect, useState } from 'react';
import { getUserMuted, getUserProfile } from '@/services/userService';
import { defaultPreferences } from '@/contexts/_filters';
import { PubkyAppUser } from 'pubky-app-specs';

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
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
    isOnline,
    setIsOnline
  } = usePubkyClientContext();
  const { openModal, closeModal } = useModal();
  const { connectionAlertStatus } = useAlertContext();
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const publicRoutes = [
    '/onboarding',
    '/onboarding/intro',
    '/onboarding/sign-in',
    '/onboarding/sign-up',
    '/logout',
    '/sign-in',
    '/copyright'
  ];

  const onboardingImages = [
    '/images/webp/home.webp',
    '/images/webp/home-mobile.webp',
    '/images/webp/intro-1.webp',
    '/images/webp/intro-1-mobile.webp',
    '/images/webp/intro-2.webp',
    '/images/webp/intro-2-mobile.webp',
    '/images/webp/intro-3.webp',
    '/images/webp/intro-3-mobile.webp',
    '/images/webp/intro-4.webp',
    '/images/webp/intro-4-mobile.webp',
    '/images/webp/intro-5.webp',
    '/images/webp/intro-5-mobile.webp',
    '/images/webp/intro-6.webp',
    '/images/webp/intro-6-mobile.webp'
  ];

  const isDynamicPublicRoute = (path: string) => {
    const dynamicPublicRoutes = ['/post/[userId]/[postId]', '/profile/[userId]'];
    return dynamicPublicRoutes.some((route) =>
      new RegExp(`^${route.replace(/\[.*?\]/g, '[^/]+').replace(/\//g, '\\/')}$`).test(path)
    );
  };

  const checkTimestamp = async () => {
    if (pubky === undefined) return;

    try {
      const result = await getTimestampNotification();
      setTimestamp(Number(result));
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
          status: userDetails.status
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

    if (sessionActive.status) {
      if (sessionActive.message === 'connection lost' || !isOnline) openModal('connectionLost');
      const hasProfile = await checkProfileUser();

      if (!hasProfile) {
        if (pathname === '/sign-in' || pathname === '/onboarding/sign-up') {
          router.push('/onboarding/register');
          return;
        }
        if (publicRoutes.includes(pathname) || pathname === '/onboarding/register' || pathname === '/logout') {
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
      if (pathname === '/onboarding/register' || (publicRoutes.includes(pathname) && pathname !== '/copyright')) {
        router.push('/home');
        return;
      }

      setLoading(false);
      setNewUser(false);
      return;
    }

    if (pubky) logout();

    // Check if the not logged user is trying to access a public route
    // Condition to show dynamicPublicRoute: !isDynamicPublicRoute(pathname)
    if (!publicRoutes.includes(pathname) && !isDynamicPublicRoute(pathname)) {
      openModal('sessionExpired');
      router.push('/onboarding');
      setTimeout(() => {
        closeModal('sessionExpired');
      }, 2000);
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

  useEffect(() => {
    const preloadImages = async () => {
      if (publicRoutes.some((route) => pathname.startsWith(route))) {
        const imagePromises = onboardingImages.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        try {
          await Promise.all(imagePromises);
          setImagesLoaded(true);
        } catch (error) {
          console.warn('Error preloading images:', error);
          setImagesLoaded(true);
        }
      } else {
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [pathname]);

  useEffect(() => {
    const handleOnline = () => {
      // Only show "connection restored" if we were previously offline
      if (!isOnline) {
        connectionAlertStatus(true);
      }
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      connectionAlertStatus(false);
    };

    // Set initial online status without showing any alert
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]); // Add isOnline to dependencies to check previous state

  return (
    <>
      <div className="z-index-999">
        <NextTopLoader color="white" />
      </div>
      {loading || !imagesLoaded ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
