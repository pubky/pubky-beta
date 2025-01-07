'use client';

import React, { useState } from 'react';
import { Icon, PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { ImageByUri } from '../ImageByUri';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { BottomSheet } from '../BottomSheet';

interface FooterMobileProps {
  title?: string;
}

const FooterMobile = ({ title }: FooterMobileProps) => {
  const { pubky } = usePubkyClientContext();
  const buttonCSS =
    'cursor-pointer p-3 bg-white/20 rounded-[48px] backdrop-blur-[32px] justify-center items-center inline-flex';
  const activeCSS = 'border-t border-white';

  const { profile } = usePubkyClientContext();
  const { unReadNotification } = useFilterContext();
  const [showSheetPost, setShowSheetPost] = useState(false);

  if (!pubky) return;

  return (
    <div className="flex justify-center lg:hidden">
      <div className="max-w-[380px] sm:max-w-[600px] md:max-w-[720px] w-full p-6 bg-gradient-to-t from-[#05050a] via-[#05050a] via-40% to-transparent flex gap-2 w-full justify-between justify-center fixed bottom-0 z-40">
        <Link
          href="/home"
          className={twMerge(buttonCSS, title === 'Feed' && activeCSS)}
        >
          <Icon.Activity size="24" />
        </Link>
        <div
          onClick={() => setShowSheetPost(true)}
          className={twMerge(buttonCSS)}
        >
          <Icon.Plus size="24" />
        </div>
        <Link
          href="/search"
          className={twMerge(buttonCSS, title === 'Search' && activeCSS)}
        >
          <Icon.MagnifyingGlassLeft size="24" />
        </Link>
        <Link
          href="/hot"
          className={twMerge(buttonCSS, title === 'HotTags' && activeCSS)}
        >
          <Icon.Fire size="24" />
        </Link>
        <Link
          href="/bookmarks"
          className={twMerge(buttonCSS, title === 'Bookmarks' && activeCSS)}
        >
          <Icon.BookmarkSimple size="24" />
        </Link>
        <Link href="/profile" className="w-[48px] relative">
          {unReadNotification !== 0 && (
            <PostUtil.Counter
              textCSS="tracking-tight text-black font-semibold text-[13px]"
              className="p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0 bg-[#C8FF00] border-white"
            >
              {unReadNotification > 21 ? '+21' : unReadNotification}
            </PostUtil.Counter>
          )}
          <ImageByUri
            id="header-profile-pic"
            width={48}
            height={48}
            className={`${
              title === 'Profile' && 'border-2 border-white'
            } rounded-full w-[48px] h-[48px]`}
            alt="user-pic"
            uri={String(profile?.image)}
          />
        </Link>
      </div>
      <BottomSheet.CreatePost show={showSheetPost} setShow={setShowSheetPost} />
    </div>
  );
};

export default FooterMobile;
