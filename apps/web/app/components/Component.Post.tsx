/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Icon,
  Button,
  Post as PostUI,
  Typography,
  PostUtil,
} from '@social/ui-shared';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Modal } from './Modal';
import Repost from './Component.Repost';
import { timeAgo } from '../../libs/time';
import { encodePostUri, minifyPubky } from '../../libs/pubkyHelper';
import { minifyText } from '../../libs/textHelper';
import { Skeleton } from '.';
import { useRouter } from 'next/navigation';
import { useClientContext } from '../../contexts/client';
import { IPost, TLayouts, TSize } from '../../types';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repost?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: IPost;
  layout?: TLayouts;
}

export default function Post({
  repost = false,
  size = 'normal',
  post,
  layout,
  ...rest
}: PostProps) {
  const router = useRouter();

  const { createTag, setRefreshList, searchTags, setSearchTags } =
    useClientContext();
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  // const [bookmark, setBookmark] = useState(false);
  const [sortedTags, setSortedTags] = useState<any[]>([]);

  useEffect(() => {
    if (post?.tags) {
      setSortedTags(post?.tags.slice().sort((a, b) => b.count - a.count));
    }
  }, [post?.tags]);

  const handleSubmit = async (tag: string) => {
    await createTag(post.uri, tag);
    // setRefreshList(true);
  };

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
                    src={post?.author?.profile?.image || '/images/Userpic.png'}
                    alt="user"
                  />
                  <div
                    className={`${
                      layout !== 'grid' && 'lg:flex'
                    } justify-start items-center gap-4`}
                  >
                    <PostUI.Username
                      className={`hover:underline hover:decoration-solid ${
                        size === 'full' ? 'lg:text-2xl' : ''
                      }`}
                    >
                      {post?.author?.profile?.name &&
                        minifyText(post?.author?.profile?.name, 24)}
                    </PostUI.Username>
                    <Typography.Label className="text-opacity-30">
                      {minifyPubky(post?.author?.id)}
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
                    text={post?.post?.content}
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
                {post?.tags?.length > 0 && (
                  <div
                    className={`flex-col inline-flex gap-4 ${
                      size === 'full' ? 'mt-6 lg:mt-0' : 'mt-6'
                    }`}
                  >
                    {sortedTags
                      .slice(0, size === 'full' ? 3 : 1)
                      .map((tagObj, index) => (
                        <PostUI.Footer key={index}>
                          <PostUtil.Tag
                            onClick={(event) => {
                              event.stopPropagation();
                              setSearchTags([...searchTags, tagObj.tag]);
                              setRefreshList(true);
                              router.push('/search');
                            }}
                            clicked
                            color="amber"
                          >
                            # {tagObj.tag}
                          </PostUtil.Tag>
                          <Button.Action
                            variant="custom"
                            size="small"
                            icon={<Icon.Plus />}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleSubmit(tagObj.tag);
                            }}
                          />
                          <PostUtil.Counter counter={tagObj.count} />
                          {tagObj?.from
                            .slice(0, 5)
                            .map((fromItem: any, fromIndex: number) => (
                              <Image
                                width={32}
                                height={32}
                                alt={`pic-${fromIndex + 1}`}
                                key={fromIndex}
                                className={`w-[32px] h-[32px] rounded-full ${
                                  fromIndex !== 0 ? '-ml-5' : ''
                                }`}
                                src={
                                  fromItem.author?.profile?.image ||
                                  '/images/Userpic.png'
                                }
                              />
                            ))}
                        </PostUI.Footer>
                      ))}
                  </div>
                )}
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
                {/* <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Repost size="16" />}
                  counter={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowModalRepost(true);
                  }}
                /> */}
                {/* <Button.Action
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
                /> */}
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
        post={post}
        setRefreshList={setRefreshList}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
    </div>
  );
}
