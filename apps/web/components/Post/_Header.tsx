'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Post as PostUI,
  Typography,
  Tooltip as TooltipUI,
} from '@social/ui-shared';

import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';

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
  const { data } = useUserProfile(post?.details?.author);
  console.log('dataUser', data);

  const [showTooltipProfile, setShowTooltipProfile] = useState('');

  return (
    <PostUI.Header>
      <div
        className="justify-start items-center gap-4 flex cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          router.push(`/profile/${post?.details?.author}`);
        }}
      >
        <PostUI.ImageUser
          uriImage={data?.details?.image || '/images/Userpic.png'}
          alt="user"
          width={largeView ? 48 : 32}
          height={largeView ? 48 : 32}
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
              {data?.details?.name && Utils.minifyText(data?.details?.name, 24)}
            </PostUI.Username>
            {!repostView && (
              <Typography.Label className="cursor-pointer text-opacity-30">
                {Utils.minifyPubky(post?.details?.author)}
              </Typography.Label>
            )}
          </div>
          {/** showTooltipProfile !== '' && <Tooltip.Profile post={post} />*/}
        </TooltipUI.Root>
      </div>
      <PostUI.Time className={largeView ? 'justify-start ml-4 mt-3.5' : ''}>
        {Utils.timeAgo(post?.details.indexed_at)}
      </PostUI.Time>
    </PostUI.Header>
  );
}
