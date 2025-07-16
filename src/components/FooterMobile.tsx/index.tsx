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

  const { unReadNotification } = useFilterContext();

  if (!pubky) return;

  return (
    <div className={`pb-20 flex justify-center lg:hidden ${isVisible ? 'opacity-100' : 'opacity-20'}`}>
      <div className="overflow-x-auto w-full max-w-[380px] sm:max-w-[600px] md:max-w-[720px] py-4 bg-[linear-gradient(0deg,#05050A_51%,rgba(5,5,10,0)_100%)] flex items-center justify-between fixed bottom-0 z-40 px-3">
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
        <Link href="/profile" className="flex-shrink-0 relative">
          {unReadNotification !== 0 && (
            <PostUtil.Counter
              textCSS="tracking-tight text-black font-semibold text-[13px]"
              className="z-20 bg-[#C8FF00] p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0"
            >
              {unReadNotification > 21 ? '+21' : unReadNotification}
            </PostUtil.Counter>
          )}
          <div className="w-12 h-12 flex-shrink-0">
            <ImageByUri
              id={pubky}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover"
              alt="user-pic"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FooterMobile;
