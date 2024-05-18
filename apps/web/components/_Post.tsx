'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import {
  Icon,
  Button,
  Post as PostUI,
  Typography,
  PostUtil,
  Tooltip as TooltipUI,
  Alert,
} from '@social/ui-shared';

import { Modal } from './Modal';
import Repost from './_Repost';
import { Utils } from '../utils';
import { useClientContext } from '../contexts/client';
import { IPost, ITaggedPost, TLayouts, TSize } from '../types';
import Tooltip from './Tooltip';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repost?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: IPost;
  layout?: TLayouts;
  fullContent?: boolean;
}

export default function Post({
  repost = false,
  size = 'full',
  post,
  layout,
  fullContent = false,
  ...rest
}: PostProps) {
  const router = useRouter();

  const {
    pubky,
    posts,
    searchTags,
    setPosts,
    setSearchTags,
    getPost,
    deleteTag,
    deletePost,
    deleteBookmark,
    createBookmark,
    createTag,
  } = useClientContext();
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showModalTag, setShowModalTag] = useState(false);
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [sortedTags, setSortedTags] = useState<ITaggedPost[]>([]);
  const [showTooltipProfile, setShowTooltipProfile] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags.slice().sort((a, b) => b.count - a.count);
      setSortedTags(sortedTags);
    }
  }, [post?.tags]);

  const handleDeletePost = async (postId: string) => {
    setShowDeleteMessage(true);
    setTimeout(() => setShowDeleteMessage(false), 2000);
    await deletePost(postId);
  };

  const handleAddBookmark = async (postId: string, uri: string) => {
    await createBookmark(postId, uri);
  };

  const handleDeleteBookmark = async (
    postId: string,
    postUri: string,
    bookmarkId: string
  ) => {
    await deleteBookmark(postId, postUri, bookmarkId);
  };

  const updatePosts = async () => {
    const updatedPost = await getPost(post.uri);

    if (!updatedPost) return;

    const updatedPosts = Object.keys(posts).map((key) => {
      if (posts[key].uri === updatedPost.uri) return updatedPost;
      return posts[key];
    });
    setPosts(updatedPosts);
  };

  const handleDeleteTag = async (tag: string) => {
    await deleteTag(post.uri, tag);
    updatePosts();
  };

  const handleAddTag = async (tag: string) => {
    await createTag(post.uri, tag);
    updatePosts();
  };

  const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    router.push('/search');
  };

  return (
    <div>
      <div className="gap-6 flex flex-col">
        <PostUI.Root
          className="cursor-pointer"
          onClick={() => router.push(Utils.encodePostUri(post?.uri))}
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
                repost
                  ? 'rounded-bl-2xl rounded-br-2xl'
                  : 'rounded-2xl flex-grow'
              }
              className={twMerge(rest.className)}
            >
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
                  <TooltipUI.Root
                    delay={200}
                    setShowTooltip={setShowTooltipProfile}
                  >
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
                <PostUI.Time>{Utils.timeAgo(post?.createdAt)}</PostUI.Time>
              </PostUI.Header>
              <div className="lg:inline-flex gap-12">
                <div
                  className={post?.tags?.length > 0 ? 'lg:w-[60%]' : 'w-full'}
                >
                  <PostUI.Content
                    text={
                      fullContent
                        ? post?.post?.content
                        : Utils.minifyText(post?.post?.content, 140)
                    }
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
                  <div className={`flex-col inline-flex gap-4 mt-6 lg:mt-0`}>
                    {sortedTags.slice(0, 3).map((tagObj, index) => {
                      const isTagFound = tagObj.from.some(
                        (fromItem) => fromItem.author.id === pubky
                      );

                      return (
                        <PostUI.Footer key={index}>
                          <PostUtil.Tag
                            onClick={(event) => {
                              event.stopPropagation();
                              handleTagSearch(tagObj.tag);
                            }}
                            clicked={isTagFound}
                            color="fuchsia"
                          >
                            #{tagObj.tag}
                          </PostUtil.Tag>
                          <Button.Action
                            variant="custom"
                            size="small"
                            icon={isTagFound ? <Icon.Minus /> : <Icon.Plus />}
                            onClick={(event) => {
                              event.stopPropagation();
                              isTagFound
                                ? handleDeleteTag(tagObj.tag)
                                : handleAddTag(tagObj.tag);
                            }}
                          />
                          <PostUtil.Counter counter={tagObj.count} />
                          {tagObj?.from
                            .slice(0, 5)
                            .map((fromItem, fromIndex: number) => (
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
                      );
                    })}
                  </div>
                )}
              </div>
              <PostUI.Actions>
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={<Icon.Tag size="16" />}
                  counter={post?.tags?.length}
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
                <Button.Action
                  size="small"
                  variant="custom"
                  icon={
                    <Icon.BookmarkSimple
                      opacity={post?.bookmark?.id ? '1' : '0.2'}
                      size="16"
                    />
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    post?.bookmark?.id
                      ? handleDeleteBookmark(
                          post.id,
                          post.uri,
                          post.bookmark.id
                        )
                      : handleAddBookmark(post.id, post.uri);
                  }}
                />
                {post?.author?.id === pubky && (
                  <Button.Action
                    size="small"
                    variant="custom"
                    icon={<Icon.Trash size="16" />}
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowModalDeletePost(true);
                    }}
                  />
                )}
              </PostUI.Actions>
            </PostUI.MainCard>
          </div>
        </PostUI.Root>
      </div>
      {showDeleteMessage && (
        <Alert.Message icon={<Icon.CheckCircle size="20" />}>
          Post successfully deleted!
        </Alert.Message>
      )}
      <Repost
        post={post}
        showModalRepost={showModalRepost}
        setShowModalRepost={setShowModalRepost}
      />
      <Modal.Tag
        post={post}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
      <Modal.DeletePost
        showModalDeletePost={showModalDeletePost}
        setShowModalDeletePost={setShowModalDeletePost}
        handleDeletePost={handleDeletePost}
        postId={post.id}
      />
    </div>
  );
}
