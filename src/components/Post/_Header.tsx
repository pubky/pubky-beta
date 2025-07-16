'use client';

import { useState } from 'react';

import { Post as PostUI, Typography, Tooltip as TooltipUI, Icon } from '@social/ui-shared';

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

export default function Header({ post, largeView = false, repostView = false }: PostProps) {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const { data } = useUserProfile(post?.details?.author, pubky ?? '');

  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const [showTooltipPostChecked, setShowTooltipPostChecked] = useState('');

  const author = post?.details?.author;
  const indexed_at = post?.details?.indexed_at;
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
        <TooltipUI.Root delay={500} tagId="1" setShowTooltip={setShowTooltipProfile}>
          <div className="justify-start items-center gap-2 flex cursor-pointer">
            {userDetails.id && (
              <PostUI.ImageUser
                id={userDetails?.id}
                isCensored={Utils.isProfileCensored(data)}
                alt={`user-${userDetails?.id}`}
                width={largeView ? 48 : 32}
                height={largeView ? 48 : 32}
              />
            )}
            <div className="justify-start items-start lg:items-center flex lg:flex-row flex-col lg:gap-4">
              <PostUI.Username className={`${largeView ? 'text-2xl' : ''} hover:underline hover:decoration-solid`}>
                {userDetails.name && Utils.minifyText(userDetails.name, 24)}
              </PostUI.Username>
              <Typography.Label className="cursor-pointer text-opacity-30 -mt-1 lg:mt-0">
                {Utils.minifyPubky(author)}
              </Typography.Label>
            </div>
          </div>
          {showTooltipProfile && !isMobile && <Tooltip.Profile post={post} />}
        </TooltipUI.Root>
      </div>
      <div className={`relative flex items-center gap-0 ${largeView ? 'hidden' : ''}`}>
        <PostUI.Time>{indexed_at}</PostUI.Time>
        {post?.details?.author === pubky && (
          <TooltipUI.Root delay={50} tagId="1" setShowTooltip={setShowTooltipPostChecked}>
            <div
              id={repostView ? 'repost-status' : 'post-status'}
              className="inline-flex items-center ml-2 top-[7px] relative"
            >
              <Icon.Check size="20" color="#00BA7C" />
              <div
                id={
                  post?.cached === 'nexus' || post?.cached === undefined
                    ? 'post-status-indexed'
                    : 'post-status-unindexed'
                }
                className="relative right-[10px]"
              >
                <Icon.Check
                  size="20"
                  color={post?.cached === 'nexus' || post?.cached === undefined ? '#00BA7C' : '#A3A3A3'}
                  opacity={post?.cached === 'nexus' || post?.cached === undefined ? 1 : 0.2}
                />
              </div>
            </div>
            {showTooltipPostChecked && !isMobile && !repostView && <Tooltip.CheckedPost cached={post?.cached} />}
          </TooltipUI.Root>
        )}
      </div>
    </PostUI.Header>
  );
}
