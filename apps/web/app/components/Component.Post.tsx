'use client';

import {
  Icon,
  Button,
  PostUtil,
  Post as PostUI,
  Typography,
} from '@social/ui-shared';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Modal } from './Modal';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repost?: boolean;
  bookmark?: boolean;
  size?: 'full' | 'normal';
}

export default function Post({
  repost = false,
  bookmark = false,
  size = 'normal',
  ...rest
}: PostProps) {
  const [showModalRepost, setShowModalRepost] = useState(false);
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
    <div>
      <div className="gap-6 flex flex-col">
        <PostUI.Root href="/post">
          <div>
            {repost && (
              <PostUI.RepostCard>
                <div className="justify-start items-center gap-4 flex">
                  <Button.Action
                    className="bg-black bg-opacity-100"
                    size="small"
                    variant="custom"
                    icon={<Icon.Repost size="16" />}
                  />
                  <PostUI.Username className="text-[15px] text-opacity-80">
                    Carl Smith reposted this
                  </PostUI.Username>
                </div>
                <PostUI.Time>3m</PostUI.Time>
              </PostUI.RepostCard>
            )}
            <PostUI.MainCard
              borderRadius={
                repost ? 'rounded-bl-2xl rounded-br-2xl' : 'rounded-2xl'
              }
              className={twMerge(rest.className)}
            >
              <PostUI.Header>
                <div className="justify-start items-center gap-4 flex">
                  <PostUI.ImageUser
                    className={size === 'full' ? 'lg:w-12 lg:h-12' : ''}
                    src="/images/user.png"
                    alt="user"
                  />
                  <PostUI.Username
                    className={size === 'full' ? 'lg:text-2xl' : ''}
                  >
                    Satoshi Nakamoto
                  </PostUI.Username>
                  <Typography.Label
                    className={
                      size === 'full'
                        ? 'hidden sm:block text-opacity-30'
                        : 'hidden'
                    }
                  >
                    @1qx8...gkw3
                  </Typography.Label>
                </div>
                <PostUI.Time>27m</PostUI.Time>
              </PostUI.Header>
              <div
                className={size === 'full' ? 'lg:inline-flex gap-12' : 'block'}
              >
                <div className={size === 'full' ? 'lg:w-[60%]' : ''}>
                  <PostUI.Content
                    text="You either want lots of people using Bitcoin (holding Bitcoin keys)
            or you dont. Many of you seem to believe things that require both
            positions."
                    className={size === 'full' ? 'lg:text-xl' : 'w-full'}
                  />
                </div>
                <PostUI.Footer
                  className={size === 'full' ? 'mt-6 lg:mt-0' : 'mt-6'}
                >
                  <PostUtil.Tag clicked color="amber">
                    #Bitcoin
                  </PostUtil.Tag>
                  <Button.Action
                    variant="custom"
                    size="small"
                    icon={<Icon.Plus />}
                  />
                  <PostUtil.Counter counter={16} />
                  <PostUI.UserPic
                    className="hidden md:inline-flex"
                    images={images}
                  />
                </PostUI.Footer>
              </div>
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
                    setShowModalRepost(true);
                  }}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={
                    <Icon.BookmarkSimple
                      opacity={bookmark ? '1' : '0.2'}
                      size="16"
                    />
                  }
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                />
              </PostUI.Actions>
            </PostUI.MainCard>
          </div>
        </PostUI.Root>
      </div>
      <Modal.Repost
        showModalRepost={showModalRepost}
        setShowModalRepost={setShowModalRepost}
      />
      <Modal.Tag
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
    </div>
  );
}
