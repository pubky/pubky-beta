'use client';

import React from 'react';
import { Icon, PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { ImageByUri } from '../ImageByUri';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import useIsScrollup from '@/hooks/useIsScrollUp';

interface FooterMobileProps {
  title?: string;
}

const FooterMobile = ({ title }: FooterMobileProps) => {
  const { pubky } = usePubkyClientContext();
  const isVisible = useIsScrollup();

  const buttonCSS =
    'cursor-pointer p-3 bg-white/20 rounded-[48px] backdrop-blur-[32px] justify-center items-center inline-flex';
  const activeCSS = 'bg-white/30';

  const { profile } = usePubkyClientContext();
  const { unReadNotification } = useFilterContext();

  if (!pubky) return;

  return (
    <div className={`flex justify-center lg:hidden ${isVisible ? 'opacity-100' : 'opacity-20'}`}>
      <div className="max-w-[380px] sm:max-w-[600px] md:max-w-[720px] w-full p-6 bg-gradient-to-t from-[#05050a] via-[#05050a] via-40% to-transparent flex gap-2 w-full justify-between justify-center fixed bottom-0 z-40">
        <Link href="/home" className={twMerge(buttonCSS, title === 'Home' && activeCSS)}>
          <Icon.House size="24" />
        </Link>
        <Link href="/search" className={twMerge(buttonCSS, title === 'Search' && activeCSS)}>
          <Icon.MagnifyingGlassLeft size="24" />
        </Link>
        <Link href="/hot" className={twMerge(buttonCSS, title === 'HotTags' && activeCSS)}>
          <Icon.Fire size="24" />
        </Link>
        <Link href="/bookmarks" className={twMerge(buttonCSS, title === 'Bookmarks' && activeCSS)}>
          <Icon.BookmarkSimple size="24" />
        </Link>
        <Link href="/settings" className={twMerge(buttonCSS, title === 'Settings' && activeCSS)}>
          <Icon.GearSix size="24" />
        </Link>
        <Link href="/profile" className="w-[48px] relative">
          {unReadNotification !== 0 && (
            <PostUtil.Counter
              textCSS="tracking-tight text-black font-semibold text-[13px]"
              className="p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0"
            >
              {unReadNotification > 21 ? '+21' : unReadNotification}
            </PostUtil.Counter>
          )}
          <ImageByUri
            id={pubky}
            width={48}
            height={48}
            className={`rounded-full w-[48px] h-[48px]`}
            alt="user-pic"
            uri={profile?.image}
          />
        </Link>
      </div>
    </div>
  );
};

export default FooterMobile;
