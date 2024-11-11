'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import {
  useAlertContext,
  usePubkyClientContext,
  useToastContext,
} from '@/contexts';
import { Utils } from '@social/utils-shared';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';
import Modal from '../Modal';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function Menu({ post, repost, setShowMenu }: TooltipMenuProps) {
  const {
    pubky,
    follow,
    unfollow,
    addBookmark,
    deleteBookmark,
    deletePost,
    deleteFile,
  } = usePubkyClientContext();
  const { data: author } = useUserProfile(post?.details?.author, pubky ?? '');
  const { setContent: setContentToast, setShow: setShowToast } =
    useToastContext();
  const tooltipMenuRef = useRef<HTMLDivElement>(null);
  const [followed, setFollowed] = useState(false);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [showModalEditPost, setShowModalEditPost] = useState(false);
  const [showModalEditArticle, setShowModalEditArticle] = useState(false);
  const { setContent, setShow } = useAlertContext();

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

  const followUser = async () => {
    if (!post?.details?.author) return;

    setLoadingFollowed(true);
    try {
      const result = await follow(post?.details?.author);
      setFollowed(result);
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
  };

  const unfollowUser = async () => {
    if (!post?.details?.author) return;

    setLoadingFollowed(true);
    try {
      const result = await unfollow(post?.details?.author);
      setFollowed(!result);
      setShowMenu(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
  };

  const handleAddBookmark = async (postId: string, uri: string) => {
    await addBookmark(postId, uri);
    setShowMenu(false);
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    await deleteBookmark(bookmarkId);
    setShowMenu(false);
  };

  const handleDeletePost = async () => {
    try {
      if (post?.details?.attachments) {
        const fileDeletions = Object.values(post?.details?.attachments).map(
          async (file) => {
            await deleteFile(file);
          }
        );
        await Promise.all(fileDeletions);
      }

      const result = await deletePost(post?.details?.id);

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
    if (post?.details?.author === pubky) return null;

    {
      /**if (initLoadingFollowed) {
      return (
        <Tooltip.Item icon={<Icon.LoadingSpin size="24" />}>
          Loading
        </Tooltip.Item>
      );
    }*/
    }

    return followed ? (
      <Tooltip.Item
        onClick={loadingFollowed ? undefined : unfollowUser}
        loading={loadingFollowed}
        icon={<Icon.UserMinus size="24" />}
      >
        Unfollow {Utils.minifyText(author?.details?.name ?? '', 10)}
      </Tooltip.Item>
    ) : (
      <Tooltip.Item
        onClick={loadingFollowed ? undefined : followUser}
        loading={loadingFollowed}
        icon={<Icon.UserPlus size="24" />}
      >
        Follow {Utils.minifyText(author?.details?.name ?? '')}
      </Tooltip.Item>
    );
  };

  const handleBookmarks = (
    repost: PostView | undefined,
    post: PostView,
    handleAddBookmark: (postId: string, uri: string) => Promise<void>,
    handleDeleteBookmark: (bookmarkId: string) => Promise<void>,
    setContentToast: (
      content: React.ReactNode,
      variant?: 'bookmark' | 'pubky' | 'link'
    ) => void,
    setShowToast: (show: boolean) => void
  ) => {
    const isBookmarked = repost ? repost.bookmark?.id : post?.bookmark?.id;

    if (repost) {
      if (isBookmarked) {
        handleDeleteBookmark(repost?.bookmark?.id ?? '');
      } else {
        handleAddBookmark(repost?.details?.id, repost?.details?.uri);
      }
    } else if (post) {
      if (isBookmarked) {
        handleDeleteBookmark(post?.bookmark?.id ?? '');
      } else {
        handleAddBookmark(post?.details?.id, post?.details?.uri);
      }
    }

    if (!isBookmarked) {
      setContentToast(
        `This post by ${author?.details?.name} was saved to your bookmarks.`,
        'bookmark'
      );
      setShowToast(true);
    }
  };

  return (
    <>
      <div ref={tooltipMenuRef}>
        <Tooltip.Main
          id="post-tooltip-menu"
          className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[250px] z-40"
        >
          {renderFollowButton()}
          {/**post?.details?.author === pubky && (
            <Tooltip.Item
              id="edit-profile"
              onClick={() => {
                router.push('/settings/edit');
                setShowMenu(false);
              }}
              icon={<Icon.Pencil size="20" />}
            >
              Edit profile
            </Tooltip.Item>
          )*/}
          {post?.details?.author === pubky && (
            <>
              {post?.details?.kind === 'Long' ? (
                <Tooltip.Item
                  id="edit-article"
                  onClick={() => setShowModalEditArticle(true)}
                  icon={<Icon.Pencil size="20" />}
                >
                  Edit article
                </Tooltip.Item>
              ) : (
                <Tooltip.Item
                  id="edit-post"
                  onClick={() => setShowModalEditPost(true)}
                  icon={<Icon.Pencil size="20" />}
                >
                  Edit post
                </Tooltip.Item>
              )}
            </>
          )}
          <Tooltip.Item
            id="copy-user-pubky"
            onClick={() => {
              copyToClipboard(`pk:${post?.details?.author}`);
              setContentToast(`pk:${post?.details?.author}`, 'pubky');
              setShowToast(true);
              setShowMenu(false);
            }}
            icon={<Icon.Key size="20" />}
          >
            Copy user pubky
          </Tooltip.Item>
          <Tooltip.Item
            id="copy-post-link"
            onClick={() => {
              copyToClipboard(
                `${window.location.origin}/post/${post?.details?.author}/${post?.details?.id}`
              );
              setContentToast(
                Utils.minifyText(
                  `${window.location.origin}/post/${post?.details?.author}/${post?.details?.id}`,
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
            id="copy-post-text"
            onClick={() => {
              copyToClipboard(post.details?.content);
              setContentToast(
                Utils.minifyContent(post.details?.content, 1),
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
            id="add-bookmark"
            icon={
              <Icon.BookmarkSimple
                size="20"
                opacity={
                  repost?.bookmark?.id ? 1 : post?.bookmark?.id ? 1 : 0.2
                }
                color={
                  repost?.bookmark?.id
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
          {post?.details.author === pubky && (
            <Tooltip.Item
              id="delete-post"
              onClick={() => setShowModalDeletePost(true)}
              icon={<Icon.Trash size="20" color={'#EF4444'} />}
              cssText="text-red-500"
            >
              Delete post
            </Tooltip.Item>
          )}
        </Tooltip.Main>

        <Modal.EditPost
          showModalEditPost={showModalEditPost}
          setShowModalEditPost={setShowModalEditPost}
          post={post}
        />
        {showModalEditArticle && (
          <Modal.EditArticle
            showModalEditArticle={showModalEditArticle}
            setShowModalEditArticle={setShowModalEditArticle}
            article={post}
          />
        )}
        <Modal.DeletePost
          showModalDeletePost={showModalDeletePost}
          setShowModalDeletePost={setShowModalDeletePost}
          handleDeletePost={handleDeletePost}
        />
      </div>
    </>
  );
}
