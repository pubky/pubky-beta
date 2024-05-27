'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip, Post, Typography, Button } from '@social/ui-shared';
import { ITaggedPost } from '../../types';
import { useRouter } from 'next/navigation';

interface TagProps {
  tags: ITaggedPost;
}

export default function Tag({ tags }: TagProps) {
  const router = useRouter();
  const [loadingFollowers, setLoadingFollowers] = useState(true);

  const [followersImages, setFollowersImages] = useState<
    { alt: string; src: string }[]
  >([]);

  useEffect(() => {
    if (tags?.count) {
      setFollowersImages(
        tags.from.slice(0, 6).map((user) => ({
          alt: 'user-pic',
          src: user.author.profile.image ?? '/images/Userpic.png',
        }))
      );
      setLoadingFollowers(false);
    }
  }, [tags]);

  return (
    <Tooltip.Main className="cursor-default min-w-[250px] translate-y-[0px]">
      <div className="flex gap-6 justify-start w-full">
        {loadingFollowers ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <div className={`w-full flex-col gap-3 inline-flex`}>
            <div className="inline-flex gap-2">
              <Typography.Label>{tags?.count}</Typography.Label>
              <Typography.Label className="text-opacity-50 text-[10px]">
                Users Tagged
              </Typography.Label>
            </div>
            <Post.UserPic images={followersImages} />
            <Button.Transparent
              icon={<Icon.Tag />}
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/search?tags=${tags.tag}`);
              }}
              className="w-full"
            >
              View All
            </Button.Transparent>
          </div>
        )}
      </div>
    </Tooltip.Main>
  );
}
