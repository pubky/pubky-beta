'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useClientContext, useAlertContext, useToastContext } from '@/contexts';
import { IPost } from '@/types';
import { Utils } from '@social/utils-shared';
import Modal from '../Modal';

interface TooltipMenuProps {
  post: IPost;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: IPost;
}

export default function Menu({ post, repost, setShowMenu }: TooltipMenuProps) {
  const {
    pubky,
    follow,
    unfollow,
    listFollowers,
    createBookmark,
    deleteBookmark,
    deletePost,
    deleteFile,
  } = useClientContext();
  const { setContent: setContentToast, setShow: setShowToast } =
    useToastContext();
  const tooltipMenuRef = useRef<HTMLDivElement>(null);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const { setContent, setShow } = useAlertContext();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (
        tooltipMenuRef.current &&
        !tooltipMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
    };
  }, [tooltipMenuRef, setShowMenu]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const pubkey = post?.author?.id || pubky;

        if (!pubkey) return;

        const followersList = await listFollowers(pubkey);

        if (followersList) {
          setInitLoadingFollowed(false);

          const isFollowed = followersList.followers.some(
            (user) => user.uri.replace('pubky:', '') === pubky
          );

          setFollowed(isFollowed);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [post?.author?.id, pubky, listFollowers]);

  const followUser = async () => {
    if (!post?.author?.id) return;

    setLoadingFollowed(true);
    try {
      const result = await follow(post?.author?.id);
      setFollowed(result);
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
  };

  const unfollowUser = async () => {
    if (!post?.author?.id) return;

    setLoadingFollowed(true);
    try {
      const result = await unfollow(post?.author?.id);
      setFollowed(!result);
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
  };

  const handleAddBookmark = async (postId: string, uri: string) => {
    await createBookmark(postId, uri);
    setShowMenu(false);
  };

  const handleDeleteBookmark = async (
    postId: string,
    postUri: string,
    bookmarkId: string
  ) => {
    await deleteBookmark(postId, postUri, bookmarkId);
    setShowMenu(false);
  };

  const handleDeletePost = async () => {
    try {
      if (post?.post?.files) {
        const fileDeletions = Object.values(post.post.files).map(
          async (file) => {
            await deleteFile(file.fileId);
          }
        );
        await Promise.all(fileDeletions);
      }

      const result = await deletePost(post?.id);

      if (result) {
        setContent('Post deleted successfully');
      } else {
        setContent('Something wrong. Try again', 'warning');
      }
      setShow(true);
    } catch (error) {
      console.log(error);
    } finally {
      setShowMenu(false);
    }
  };
  const renderFollowButton = () => {
    if (post?.author?.id === pubky) return null;

    if (initLoadingFollowed) {
      return (
        <Tooltip.Item icon={<Icon.LoadingSpin size="24" />}>
          Loading
        </Tooltip.Item>
      );
    }

    return followed ? (
      <Tooltip.Item
        onClick={loadingFollowed ? undefined : unfollowUser}
        loading={loadingFollowed}
        icon={<Icon.UserMinus size="24" />}
      >
        Unfollow {Utils.minifyText(post?.author?.profile?.name, 10)}
      </Tooltip.Item>
    ) : (
      <Tooltip.Item
        onClick={loadingFollowed ? undefined : followUser}
        loading={loadingFollowed}
        icon={<Icon.UserPlus size="24" />}
      >
        Follow {Utils.minifyText(post?.author?.profile?.name)}
      </Tooltip.Item>
    );
  };

  const handleBookmarks = (
    repost: IPost | undefined,
    post: IPost,
    handleAddBookmark: (postId: string, uri: string) => Promise<void>,
    handleDeleteBookmark: (
      postId: string,
      postUri: string,
      bookmarkId: string
    ) => Promise<void>,
    setContentToast: (
      content: React.ReactNode,
      variant?: 'bookmark' | 'pubky' | 'link'
    ) => void,
    setShowToast: (show: boolean) => void
  ) => {
    const isBookmarked = repost ? repost.bookmark?.id : post?.bookmark?.id;

    if (repost) {
      if (isBookmarked) {
        handleDeleteBookmark(repost.id, repost.uri, repost.bookmark.id);
      } else {
        handleAddBookmark(repost.id, repost.uri);
      }
    } else if (post) {
      if (isBookmarked) {
        handleDeleteBookmark(post.id, post.uri, post.bookmark.id);
      } else {
        handleAddBookmark(post.id, post.uri);
      }
    }

    if (!isBookmarked) {
      setContentToast(
        `This post by ${
          repost ? repost?.author?.profile?.name : post?.author?.profile?.name
        } was saved to your bookmarks.`,
        'bookmark'
      );
      setShowToast(true);
    }
  };

  return (
    <>
      <div ref={tooltipMenuRef}>
        <Tooltip.Main className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[250px]">
          {renderFollowButton()}
          {post?.author?.id === pubky && (
            <Tooltip.Item
              onClick={() => {
                router.push('/settings/edit');
                setShowMenu(false);
              }}
              icon={<Icon.GearSix size="20" />}
            >
              Edit profile
            </Tooltip.Item>
          )}
          <Tooltip.Item
            onClick={() => {
              copyToClipboard(`pk:${post.author.id}`);
              setContentToast(`pk:${post.author.id}`, 'pubky');
              setShowToast(true);
              setShowMenu(false);
            }}
            icon={<Icon.Key size="20" />}
          >
            Copy user pubky
          </Tooltip.Item>
          <Tooltip.Item
            onClick={() => {
              copyToClipboard(
                `${window.location.origin}/post/${post.author.id}/${post.id}`
              );
              setContentToast(
                Utils.minifyText(
                  `${window.location.origin}/post/${post.author.id}/${post.id}`,
                  80
                ),
                'link'
              );
              setShowToast(true);
              setShowMenu(false);
            }}
            icon={<Icon.Link size="20" />}
          >
            Copy link to post
          </Tooltip.Item>
          <Tooltip.Item
            onClick={() => {
              copyToClipboard(post.post.content);
              setContentToast(
                Utils.minifyContent(post.post.content, 1),
                'text'
              );
              setShowToast(true);
              setShowMenu(false);
            }}
            icon={<Icon.FileText size="20" />}
          >
            Copy text of post
          </Tooltip.Item>
          <Tooltip.Item
            icon={
              <Icon.BookmarkSimple
                size="20"
                opacity={repost?.bookmark.id ? 1 : post?.bookmark?.id ? 1 : 0.2}
                color={
                  repost?.bookmark.id
                    ? 'white'
                    : post?.bookmark?.id
                    ? 'white'
                    : 'white'
                }
              />
            }
            onClick={() =>
              handleBookmarks(
                repost,
                post,
                handleAddBookmark,
                handleDeleteBookmark,
                setContentToast,
                setShowToast
              )
            }
          >
            {repost?.bookmark?.id
              ? 'Remove Bookmark'
              : post?.bookmark?.id
              ? 'Remove Bookmark'
              : 'Add Bookmark'}
          </Tooltip.Item>
          {post?.author?.id === pubky && (
            <Tooltip.Item
              onClick={() => setShowModalDeletePost(true)}
              icon={<Icon.Trash size="20" color={'#EF4444'} />}
              cssText="text-red-500"
            >
              Delete post
            </Tooltip.Item>
          )}
        </Tooltip.Main>
        <Modal.DeletePost
          showModalDeletePost={showModalDeletePost}
          setShowModalDeletePost={setShowModalDeletePost}
          handleDeletePost={handleDeletePost}
        />
      </div>
    </>
  );
}
