'use client';

import { useEffect, useState } from 'react';
import { Header as HeaderUI } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { usePathname } from 'next/navigation';

interface HeaderMobileProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function HeaderMobile({
  leftIcon = <div></div>,
  rightIcon = <div></div>,
  children,
}: HeaderMobileProps) {
  const pathname = usePathname();
  const { pubky, isLoggedIn, setSearchTags } = usePubkyClientContext();
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

  return (
    <HeaderUI.Root className="justify-start flex lg:hidden">
      <div className="w-full flex gap-4 justify-between items-center">
        {pubky && <>{leftIcon}</>}
        <div className="flex gap-4 xl:min-w-[180px]">
          <HeaderUI.Logo link={logoLink} />
          <HeaderUI.Title />
        </div>
        {pubky && <>{rightIcon}</>}
      </div>
      {children}
    </HeaderUI.Root>
  );
}
