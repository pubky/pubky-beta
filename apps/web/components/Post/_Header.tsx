'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Post as PostUI,
  Typography,
  Tooltip as TooltipUI,
} from '@social/ui-shared';

import { Utils } from '../../utils';
import { IPost } from '../../types';
import Tooltip from '../Tooltip';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
}

export default function Header({ post }: PostProps) {
  const router = useRouter();

  const [showTooltipProfile, setShowTooltipProfile] = useState(false);

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
        />
        <TooltipUI.Root delay={200} setShowTooltip={setShowTooltipProfile}>
          <div className={`justify-start items-center lg:flex gap-4`}>
            <PostUI.Username
              className={`hover:underline hover:decoration-solid`}
            >
              {post?.author?.profile?.name &&
                Utils.minifyText(post?.author?.profile?.name, 24)}
            </PostUI.Username>
            <Typography.Label className="text-opacity-30">
              {Utils.minifyPubky(post?.author?.id)}
            </Typography.Label>
          </div>
          {showTooltipProfile && <Tooltip.Profile post={post} />}
        </TooltipUI.Root>
      </div>
      <div
        className="justify-end cursor-pointer grow"
        onClick={(event) => {
          event.stopPropagation();
          router.push(Utils.encodePostUri(post?.uri));
        }}
      >
        <PostUI.Time>{Utils.timeAgo(post?.createdAt)}</PostUI.Time>
      </div>
    </PostUI.Header>
  );
}
