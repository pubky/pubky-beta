'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Post as PostUI,
  Typography,
  Tooltip as TooltipUI,
} from '@social/ui-shared';

import { Utils } from '@social/utils-shared';
import { IPost } from '@/types';
import Tooltip from '../Tooltip';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  largeView?: boolean;
}

export default function Header({ post, largeView = false }: PostProps) {
  const router = useRouter();

  const [showTooltipProfile, setShowTooltipProfile] = useState('');

  return (
    <PostUI.Header>
      <div
        className="justify-start items-center gap-4 flex cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          router.push(`/profile/${post?.author?.id}`);
        }}
      >
        <PostUI.ImageUser
          src={post?.author?.profile?.image || '/images/Userpic.png'}
          alt="user"
          width={largeView ? 48 : 32}
          height={largeView ? 48 : 32}
          className="z-[1]"
        />
        <TooltipUI.Root
          delay={500}
          tagId="1"
          setShowTooltip={setShowTooltipProfile}
        >
          <div className={`justify-start items-center lg:flex gap-4`}>
            <PostUI.Username
              className={`${
                largeView && 'text-2xl'
              } hover:underline hover:decoration-solid`}
            >
              {post?.author?.profile?.name &&
                Utils.minifyText(post?.author?.profile?.name, 24)}
            </PostUI.Username>
            <Typography.Label className="cursor-pointer text-opacity-30">
              {Utils.minifyPubky(post?.author?.id)}
            </Typography.Label>
          </div>
          {showTooltipProfile !== '' && <Tooltip.Profile post={post} />}
        </TooltipUI.Root>
      </div>
      <PostUI.Time className={largeView ? 'justify-start ml-4 mt-3.5' : ''}>
        {Utils.timeAgo(post?.createdAt)}
      </PostUI.Time>
    </PostUI.Header>
  );
}
