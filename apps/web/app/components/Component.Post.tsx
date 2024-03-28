'use client';

import { Icon, Button, Post as PostUI, Typography } from '@social/ui-shared';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Modal } from './Modal';
import Repost from './Component.Repost';
import { timeAgo } from '../../libs/time';
import { encodePostUri, minifyPubky } from '../../libs/pubkyHelper';
import { Skeleton } from '.';
import { useRouter } from 'next/navigation';

import { PostProps } from '../../types';

export default function Post({
  repost = false,
  size = 'normal',
  post,
  layout,
  ...rest
}: PostProps) {
  const router = useRouter();

  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  if (!post) return <Skeleton.Post size={size} />;

  return (
    <div>
      <div className="gap-6 flex flex-col">
        <PostUI.Root
          className="cursor-pointer"
          onClick={() => router.push(encodePostUri(post?.uri))}
        >
          <div>
            {/* {repost && (
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
            )} */}
            <PostUI.MainCard
              borderRadius={
                repost ? 'rounded-bl-2xl rounded-br-2xl' : 'rounded-2xl'
              }
              className={twMerge(rest.className)}
            >
              <PostUI.Header size={size}>
                <div
                  className="justify-start items-center gap-4 flex cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/profile/${post?.author?.id}`);
                  }}
                >
                  <PostUI.ImageUser
                    className={size === 'full' ? 'lg:w-12 lg:h-12' : ''}
                    src={post?.author?.profile?.image || '/images/user.png'}
                    alt="user"
                  />
                  <div
                    className={`${
                      layout !== 'grid' && 'lg:flex'
                    } justify-start items-center gap-4`}
                  >
                    <PostUI.Username
                      className={size === 'full' ? 'lg:text-2xl' : ''}
                    >
                      {post?.author?.profile?.name}
                    </PostUI.Username>
                    <Typography.Label
                      className={
                        size === 'full' ? 'hidden sm:block text-opacity-30' : ''
                      }
                    >
                      {minifyPubky(post?.author?.uri)}
                    </Typography.Label>
                  </div>
                </div>
                <PostUI.Time size={size}>
                  {timeAgo(post?.createdAt)}
                </PostUI.Time>
              </PostUI.Header>
              <div
                className={size === 'full' ? 'lg:inline-flex gap-12' : 'block'}
              >
                <div className={size === 'full' ? 'lg:w-[60%]' : ''}>
                  <PostUI.Content
                    text={post?.post?.payload?.content}
                    className={size === 'full' ? 'lg:text-xl' : 'w-full'}
                  />
                  {/** <img
                    alt="postImage"
                    src="/images/user.png"
                    className="mt-6 max-w-full rounded-2xl"
                  />
                  <>
                    <Content.Divider />
                    <Typography.H2>
                      Weighing Options of Bitcoin Private Key Management
                    </Typography.H2>{' '}
                    <Typography.Caption className="text-white text-opacity-80">
                      https://bitcoinmagazine.com/
                    </Typography.Caption>
                    <img
                      alt="postImage"
                      src="/images/user.png"
                      className="mt-6 max-w-full rounded-2xl"
                    />
                  </>
                  */}
                </div>
                {/**
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

                  <PostUtil.Counter counter={0} />
                  <PostUI.UserPic
                    className="hidden md:inline-flex"
                    images={images}
                  />
                </PostUI.Footer>
                  */}
              </div>
              <PostUI.Actions>
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Tag size="16" />}
                  counter={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowModalTag(true);
                  }}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.ChatCircleText size="16" />}
                  counter={0}
                />
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Repost size="16" />}
                  counter={0}
                  onClick={(event) => {
                    event.stopPropagation();
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
                    event.stopPropagation();
                    setBookmark(!bookmark);
                  }}
                />
              </PostUI.Actions>
            </PostUI.MainCard>
          </div>
        </PostUI.Root>
      </div>
      <Repost
        post={post}
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
