'use client';

import { useState } from 'react';

import {
  Post as PostUI,
  Typography,
  Tooltip as TooltipUI,
} from '@social/ui-shared';

import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { UserDetails } from '@/types/User';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
  repostView?: boolean;
}

export default function Header({
  post,
  largeView = false,
  repostView = false,
}: PostProps) {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const { data } = useUserProfile(post?.details?.author, pubky ?? '');

  const [showTooltipProfile, setShowTooltipProfile] = useState('');

  const {
    details: { author, indexed_at },
  } = post;
  const userDetails = data?.details || ({} as UserDetails);

  return (
    <PostUI.Header className="w-full justify-between">
      <div
        className="justify-start items-center gap-4 flex cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          router.push(`/profile/${author}`);
        }}
      >
        <TooltipUI.Root
          delay={500}
          tagId="1"
          setShowTooltip={setShowTooltipProfile}
        >
          <div className="justify-start items-center gap-2 flex cursor-pointer">
            <PostUI.ImageUser
              uriImage={userDetails?.image || '/images/webp/Userpic.webp'}
              alt="user"
              width={largeView ? 48 : 32}
              height={largeView ? 48 : 32}
            />
            <div className="justify-start items-start lg:items-center flex lg:flex-row flex-col lg:gap-4">
              <PostUI.Username
                className={`${
                  largeView ? 'text-2xl' : ''
                } hover:underline hover:decoration-solid`}
              >
                {userDetails.name && Utils.minifyText(userDetails.name, 24)}
              </PostUI.Username>
              {!repostView && (
                <Typography.Label className="cursor-pointer text-opacity-30 -mt-1 lg:mt-0">
                  {Utils.minifyPubky(author)}
                </Typography.Label>
              )}
            </div>
          </div>
          {showTooltipProfile && !isMobile && <Tooltip.Profile post={post} />}
        </TooltipUI.Root>
      </div>
      <PostUI.Time className={largeView ? 'justify-start ml-4 mt-3.5' : ''}>
        <span className="hidden md:flex">{Utils.timeAgo(indexed_at)}</span>
        <span className="md:hidden">{Utils.timeAgo(indexed_at, true)}</span>
      </PostUI.Time>
    </PostUI.Header>
  );
}
