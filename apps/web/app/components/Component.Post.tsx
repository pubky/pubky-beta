/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Icon, Button, PostUtil, Post as PostUI } from '@social/ui-shared';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface PostsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Post({ ...rest }: PostsLayoutProps) {
  const [showModalRePost, setShowModalRePost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const images = [
    {
      src: '/images/user.png',
      alt: '1',
    },
    {
      src: '/images/user.png',
      alt: '2',
    },
    {
      src: '/images/user.png',
      alt: '3',
    },
    {
      src: '/images/user.png',
      alt: '4',
    },
    {
      src: '/images/user.png',
      alt: '5',
    },
  ];

  return (
    <div className="gap-6 flex flex-col">
      <PostUI.Root href="/post">
        <PostUI.MainCard className={twMerge(rest.className)}>
          <PostUI.Header>
            <div className="justify-start items-center gap-4 flex">
              <PostUI.ImageUser src="/images/user.png" alt="user" />
              <PostUI.Username>Satoshi Nakamoto</PostUI.Username>
            </div>
            <PostUI.Time>27m</PostUI.Time>
          </PostUI.Header>
          <PostUI.Content
            text="You either want lots of people using Bitcoin (holding Bitcoin keys)
            or you dont. Many of you seem to believe things that require both
            positions."
          />
          <PostUI.Footer>
            <PostUtil.Tag clicked color="amber">
              #Bitcoin
            </PostUtil.Tag>
            <Button.Action variant="custom" size="small" icon={<Icon.Plus />} />
            <PostUtil.Counter counter={16} />
            <PostUI.UserPic images={images} />
          </PostUI.Footer>
          <PostUI.Actions>
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.Tag size="16" />}
              counter={3}
              onClick={(event) => {
                event.preventDefault();
                setShowModalTag(true);
              }}
            />
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.ChatCircleText size="16" />}
              counter={2}
              onClick={(event) => {
                event.preventDefault();
              }}
            />
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.Repost size="16" />}
              counter={7}
              onClick={(event) => {
                event.preventDefault();
                setShowModalRePost(true);
              }}
            />
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.BookmarkSimple size="16" />}
              onClick={(event) => {
                event.preventDefault();
              }}
            />
          </PostUI.Actions>
        </PostUI.MainCard>
      </PostUI.Root>
    </div>
  );
}
