'use client';

import { useState } from 'react';
import { Icon, Button, Post as PostUI } from '@social/ui-shared';

import Repost from '../Repost';
import { useClientContext, useAlertContext, useToastContext } from '@/contexts';
import { IPost } from '@/types';
import Tooltip from '../Tooltip';
import Modal from '../Modal';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  repost?: IPost;
  deleteRepost?: boolean;
}

export default function Actions({
  post,
  repost,
  deleteRepost = false,
}: PostProps) {
  const { deleteBookmark, createBookmark, createRepost, deletePost } =
    useClientContext();
  const { setContent, setShow } = useAlertContext();
  const { setContent: setContentToast, setShow: setShowToast } =
    useToastContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showModalReply, setShowModalReply] = useState(false);
  const [showRepostMenu, setShowRepostMenu] = useState(false);

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

  const handleRepost = async () => {
    const result = await createRepost(post.uri);
    if (result) {
      setContent('Repost created!');
      setShow(true);
    } else {
      setContent('Something wrong. Try again', 'warning');
      setShow(true);
    }
  };

  const handleDeleteRepost = async () => {
    if (repost?.id) {
      const result = await deletePost(repost?.id);
      if (result) {
        setContent('Repost deleted!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
    }
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
    } else {
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
    <div
      className="cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <PostUI.Actions>
        <Button.Action
          id='reply-btn'
          size="small"
          variant="custom"
          icon={<Icon.ChatCircleText size="16" />}
          counter={post?.repliesCount}
          onClick={(event) => {
            event.stopPropagation();
            setShowModalReply(true);
          }}
        />
        <div className="relative">
          {showRepostMenu && (
            <Tooltip.RepostMenu
              setShowRepostMenu={setShowRepostMenu}
              setShowModalRepost={setShowModalRepost}
              handleRepost={handleRepost}
              deleteRepost={deleteRepost}
              handleDeleteRepost={handleDeleteRepost}
            />
          )}
          <Button.Action
            id='repost-btn'
            size="small"
            variant="custom"
            icon={
              <Icon.Repost
                size="16"
                color="white"
                //color={deleteRepost ? '#00BA7C' : 'white'}
              />
            }
            counter={post?.repostsCount}
            onClick={(event) => {
              event.stopPropagation();
              //setShowRepostMenu(true);
              setShowModalRepost(true);
            }}
          />
        </div>
        <Button.Action
          id='bookmark-btn'
          size="small"
          variant="custom"
          icon={
            <Icon.BookmarkSimple
              size="16"
              opacity={repost?.bookmark.id ? 1 : post?.bookmark?.id ? 1 : 0.2}
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
        />
        <div className="relative" onClick={(event) => event.stopPropagation()}>
          {showMenu && (
            <Tooltip.Menu
              post={post}
              repost={repost}
              setShowMenu={setShowMenu}
            />
          )}
          <Button.Action
            id='menu-btn'
            size="small"
            variant="custom"
            icon={<Icon.DotsThreeOutline size="16" color="white" />}
            onClick={(event) => {
              event.stopPropagation();
              setShowMenu(true);
            }}
          />
        </div>
      </PostUI.Actions>
      <Repost
        post={post}
        handleRepost={handleRepost}
        showModalRepost={showModalRepost}
        setShowModalRepost={setShowModalRepost}
      />
      <Modal.CreateReply
        post={post}
        showModalReply={showModalReply}
        setShowModalReply={setShowModalReply}
      />
    </div>
  );
}
