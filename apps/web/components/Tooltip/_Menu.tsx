'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useClientContext } from '../../contexts/client';
import { useAlertContext } from '../../contexts/alerts';
import { IPost } from '../../types';
import { Utils } from '../../../web/utils';
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
  } = useClientContext();
  const tooltipMenuRef = useRef<HTMLDivElement>(null);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [copiedPubky, setCopiedPubky] = useState(false);
  const [copiedLinkPost, setCopiedLinkPost] = useState(false);
  const [copiedTextPost, setCopiedTextPost] = useState(false);
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
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

  const handleDeletePost = async () => {
    const result = await deletePost(post?.id);
    if (result) {
      setContent('Post deleted successfully');
      setShow(true);
    } else {
      setContent('Something wrong. Try again', 'warning');
      setShow(true);
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

  return (
    <>
      <div ref={tooltipMenuRef}>
        <Tooltip.Main className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[250px]">
          {renderFollowButton()}
          {post?.author?.id === pubky && (
            <Tooltip.Item
              onClick={() => router.push('/settings')}
              icon={<Icon.GearSix size="20" />}
            >
              Edit profile
            </Tooltip.Item>
          )}
          <Tooltip.Item
            onClick={() => {
              copyToClipboard(`pk:${post.author.id}`);
              setCopiedPubky(true);
              setTimeout(() => setCopiedPubky(false), 1000);
            }}
            icon={
              copiedPubky ? (
                <Icon.CheckCircle size="20" />
              ) : (
                <Icon.UserCircle size="20" />
              )
            }
          >
            {copiedPubky ? 'Copied' : 'Copy user Pubky'}
          </Tooltip.Item>
          <Tooltip.Item
            onClick={() => {
              copyToClipboard(
                `${window.location.origin}/post/${post.author.id}/${post.id}`
              );
              setCopiedLinkPost(true);
              setTimeout(() => setCopiedLinkPost(false), 1000);
            }}
            icon={
              copiedLinkPost ? (
                <Icon.CheckCircle size="20" />
              ) : (
                <Icon.LinkSimple size="20" />
              )
            }
          >
            {copiedLinkPost ? 'Copied' : 'Copy link post'}
          </Tooltip.Item>
          <Tooltip.Item
            onClick={() => {
              copyToClipboard(post.post.content);
              setCopiedTextPost(true);
              setTimeout(() => setCopiedTextPost(false), 1000);
            }}
            icon={
              copiedTextPost ? (
                <Icon.CheckCircle size="20" />
              ) : (
                <Icon.FileText size="20" />
              )
            }
          >
            {copiedTextPost ? 'Copied' : 'Copy text post'}
          </Tooltip.Item>
          <Tooltip.Item
            icon={
              <Icon.BookmarkSimple
                size="20"
                opacity={repost?.bookmark.id ? 1 : post?.bookmark?.id ? 1 : 0.5}
                color={
                  repost?.bookmark.id
                    ? '#d946efc9'
                    : post?.bookmark?.id
                    ? '#d946efc9'
                    : 'white'
                }
              />
            }
            onClick={() =>
              repost
                ? repost.bookmark?.id
                  ? handleDeleteBookmark(
                      repost.id,
                      repost.uri,
                      repost.bookmark.id
                    )
                  : handleAddBookmark(repost.id, repost.uri)
                : post?.bookmark?.id
                ? handleDeleteBookmark(post.id, post.uri, post.bookmark.id)
                : handleAddBookmark(post.id, post.uri)
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
