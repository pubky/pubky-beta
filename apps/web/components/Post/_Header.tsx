'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Post as PostUI,
  Typography,
  Tooltip as TooltipUI,
  Icon,
} from '@social/ui-shared';

import { Utils } from '@social/utils-shared';
import { IPost } from '../../types';
import Tooltip from '../Tooltip';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  repost?: IPost;
  repostView?: boolean;
}

export default function Header({
  post,
  repost,
  repostView = false,
}: PostProps) {
  const router = useRouter();

  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const [showMenu, setShowMenu] = useState(false);

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
          className="z-[1]"
        />
        <TooltipUI.Root
          delay={200}
          tagId="1"
          setShowTooltip={setShowTooltipProfile}
        >
          <div className={`justify-start items-center lg:flex gap-4`}>
            <PostUI.Username
              className={`hover:underline hover:decoration-solid`}
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
      <div className="justify-end grow">
        <PostUI.Time>{Utils.timeAgo(post?.createdAt)}</PostUI.Time>
      </div>
      {!repostView && (
        <div className="relative" onClick={(event) => event.stopPropagation()}>
          {showMenu && (
            <Tooltip.Menu
              post={post}
              repost={repost}
              setShowMenu={setShowMenu}
            />
          )}
          <div
            className="mt-1 ml-2 cursor-pointer rounded-full hover:bg-white hover:bg-opacity-10"
            onClick={() => setShowMenu(true)}
          >
            <Icon.DotsThree size="24" color="gray" />
          </div>
        </div>
      )}
    </PostUI.Header>
  );
}
