'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Tooltip, Post, Typography } from '@social/ui-shared';
import { ITaggedPost } from '../../types';
import { Utils } from '../../utils';

interface TagProps {
  tags: ITaggedPost;
  setShowModalTags: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTag: React.Dispatch<
    React.SetStateAction<ITaggedPost | null | undefined>
  >;
}

export default function Tag({
  tags,
  setShowModalTags,
  setSelectedTag,
}: TagProps) {
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
                Tagged by
              </Typography.Label>
            </div>
            <Post.UserPic
              onClick={() => {
                setShowModalTags(true);
                setSelectedTag(tags);
              }}
              className="cursor-pointer"
              images={followersImages}
            />
            <div
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/search?tags=${tags.tag}`);
              }}
              className="p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer flex inline-flex items-center justify-center gap-1"
            >
              <div>
                <Icon.MagnifyingGlass size="16" />
              </div>
              <Typography.Body
                className="text-center text-opacity-80 break-all"
                variant="small-bold"
              >
                {Utils.minifyText(tags.tag, 20)}
              </Typography.Body>
            </div>
          </div>
        )}
      </div>
    </Tooltip.Main>
  );
}
