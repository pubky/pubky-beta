'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Icon, Tooltip } from '@social/ui-shared';
import { useClientContext } from '../../contexts/client';
import { IPost } from '../../types';
import { useRouter } from 'next/navigation';
import { Utils } from '../../../web/utils';
import Modal from '../Modal';

interface TooltipMenuProps {
  post: IPost;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Menu({ post, setShowMenu }: TooltipMenuProps) {
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
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
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

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey;

        if (post?.author?.id) {
          pubkey = post?.author?.id;
        }

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followersList = await listFollowers(pubkey);

        if (followersList) {
          setInitLoadingFollowed(false);

          followersList.followers.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
            if (uri === pubky) {
              setFollowed(true);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followed, post?.author?.id]);

  const followUser = async () => {
    try {
      if (!post?.author?.id) return;
      setLoadingFollowed(true);

      const result = await follow(post?.author?.id);
      setFollowed(result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!post?.author?.id) return;
      setLoadingFollowed(true);

      const result = await unfollow(post?.author?.id);
      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
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

  const handleDeletePost = async (postId: string) => {
    setShowDeleteMessage(true);
    setTimeout(() => setShowDeleteMessage(false), 2000);
    await deletePost(postId);
  };

  return (
    <div ref={tooltipMenuRef}>
      <Tooltip.Main className="px-4 py-6 bottom-0 -translate-x-[90%] cursor-default w-[300px]">
        {initLoadingFollowed ? (
          <Tooltip.Item
            className={post?.author?.id === pubky ? 'hidden' : ''}
            icon={<Icon.LoadingSpin size="24" />}
          >
            Loading
          </Tooltip.Item>
        ) : followed ? (
          <Tooltip.Item
            onClick={loadingFollowed ? undefined : () => unfollowUser()}
            loading={loadingFollowed}
            className={post?.author?.id === pubky ? 'hidden' : ''}
            icon={<Icon.UserMinus size="24" />}
          >
            Unfollow {Utils.minifyText(post?.author?.profile?.name)}
          </Tooltip.Item>
        ) : (
          <Tooltip.Item
            onClick={loadingFollowed ? undefined : () => followUser()}
            loading={loadingFollowed}
            className={post?.author?.id === pubky ? 'hidden' : ''}
            icon={<Icon.UserPlus size="24" />}
          >
            Follow {Utils.minifyText(post?.author?.profile?.name)}
          </Tooltip.Item>
        )}
        {post?.author?.id === pubky && (
          <Tooltip.Item
            onClick={() => router.push('/settings')}
            icon={<Icon.GearSix size="24" />}
          >
            Edit profile
          </Tooltip.Item>
        )}
        <Tooltip.Item
          icon={
            <Icon.BookmarkSimple
              size="24"
              opacity={post?.bookmark?.id ? '1' : '0.2'}
            />
          }
          onClick={() => {
            post?.bookmark?.id
              ? handleDeleteBookmark(post.id, post.uri, post.bookmark.id)
              : handleAddBookmark(post.id, post.uri);
          }}
        >
          Save to bookmarks
        </Tooltip.Item>
        {post?.author?.id === pubky && (
          <Tooltip.Item
            onClick={() => setShowModalDeletePost(true)}
            icon={<Icon.Trash size="24" color={'#EF4444'} />}
            cssText="text-red-500"
          >
            Delete post
          </Tooltip.Item>
        )}
      </Tooltip.Main>
      {showDeleteMessage && (
        <Alert.Message icon={<Icon.CheckCircle size="20" />}>
          Post successfully deleted!
        </Alert.Message>
      )}
      <Modal.DeletePost
        showModalDeletePost={showModalDeletePost}
        setShowModalDeletePost={setShowModalDeletePost}
        handleDeletePost={handleDeletePost}
        postId={post.id}
      />
    </div>
  );
}
