import React, { useEffect, useRef, useState } from 'react';
import { Icon, PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { ImageByUri } from '../ImageByUri';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import Modal from '../Modal';

interface FooterMobileProps {
  title?: string;
}

const FooterMobile = ({ title }: FooterMobileProps) => {
  const buttonCSS =
    'cursor-pointer p-3 bg-white/20 rounded-[48px] backdrop-blur-[32px] justify-center items-center inline-flex';
  const activeCSS = 'border-t border-white';

  const { profile } = usePubkyClientContext();
  const { unReadNotification } = useFilterContext();
  const [showModalPost, setShowModalPost] = useState(false);
  const modalPostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalPostRef.current &&
        !modalPostRef.current.contains(event.target as Node)
      ) {
        setShowModalPost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalPostRef]);
  return (
    <div className="flex justify-center lg:hidden">
      <div className="max-w-[380px] sm:max-w-[600px] md:max-w-[720px] w-full p-6 bg-gradient-to-t from-[#05050a] to-transparent flex gap-2 w-full justify-between justify-center fixed bottom-1 z-50">
        <Link
          href="/home"
          className={twMerge(buttonCSS, title === 'Feed' && activeCSS)}
        >
          <Icon.Activity size="24" />
        </Link>
        <div
          onClick={() => setShowModalPost(true)}
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
          href="/influencers"
          className={twMerge(buttonCSS, title === 'Influencers' && activeCSS)}
        >
          <Icon.UsersLeft size="24" />
        </Link>
        <Link
          href="/hot-tags"
          className={twMerge(buttonCSS, title === 'HotTags' && activeCSS)}
        >
          <Icon.Fire size="24" />
        </Link>
        <Link href="/profile" className="w-[48px] relative">
          {unReadNotification !== 0 && (
            <PostUtil.Counter
              textCSS="tracking-tight text-black font-semibold text-[13px]"
              className="p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0 bg-white border-white"
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
      <Modal.CreatePost
        showModalPost={showModalPost}
        setShowModalPost={setShowModalPost}
        modalPostRef={modalPostRef}
      />
    </div>
  );
};

export default FooterMobile;
