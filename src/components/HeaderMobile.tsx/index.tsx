'use client';

import { useEffect, useState } from 'react';
import { Header as HeaderUI, Icon } from '@social/ui-shared';
import { useModal, usePubkyClientContext } from '@/contexts';
import { usePathname, useRouter } from 'next/navigation';
import useIsScrollup from '@/hooks/useIsScrollUp';

interface HeaderMobileProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  postView?: boolean;
}

export default function HeaderMobile({ leftIcon, rightIcon, children, postView }: HeaderMobileProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useModal();
  const { pubky, isLoggedIn, setSearchTags } = usePubkyClientContext();
  const isVisible = useIsScrollup();
  const [logoLink, setLogoLink] = useState('/onboarding');

  async function fetchLoggedIn() {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      setLogoLink('/onboarding');
    } else {
      setLogoLink('/home');
    }
  }

  useEffect(() => {
    fetchLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  useEffect(() => {
    if (pathname !== '/search') {
      setSearchTags([]);
    }
  }, [pathname, setSearchTags]);

  const handleBack = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if there's enough history to go back
    if (window.history.length > 2) {
      router.back();
    } else {
      if (pubky) {
        router.push('/home');
      } else {
        router.push('/onboarding');
      }
    }
  };

  return (
    <HeaderUI.Root className={`flex lg:hidden items-center ${!isVisible && 'hidden'}`}>
      <div className="relative flex w-full items-center">
        {pubky && <div className="absolute left-0">{leftIcon}</div>}

        <div onClick={postView ? handleBack : undefined} className="mx-auto flex gap-4 items-center">
          <HeaderUI.Logo link={logoLink} />
          <HeaderUI.Title />
        </div>

        {pubky ? (
          <div className="absolute right-0">{rightIcon}</div>
        ) : (
          <div
            onClick={() => openModal('join')}
            className="absolute right-0 mr-2 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full cursor-pointer"
          >
            <Icon.User size="20" />
          </div>
        )}
      </div>
      {children}
    </HeaderUI.Root>
  );
}
