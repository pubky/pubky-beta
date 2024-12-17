'use client';

import { useState } from 'react';
import { Icon, Button, Post as PostUI } from '@social/ui-shared';
import { usePubkyClientContext, useToastContext } from '@/contexts';
import Tooltip from '../Tooltip';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';
import Modal from '../Modal';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  repost?: PostView;
  deleteRepost?: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookmarkButton = ({
  isBookmarked,
  loadingBookmarks,
  handleBookmarks,
}: {
  isBookmarked: string;
  loadingBookmarks: boolean;
  handleBookmarks: () => void;
}) => (
  <Button.Action
    id="bookmark-btn"
    size="small"
    variant="custom"
    disabled={loadingBookmarks}
    icon={
      loadingBookmarks ? (
        <div>
          <Icon.LoadingSpin size="16" />
        </div>
      ) : (
        <div>
          <Icon.BookmarkSimple
            size="16"
            opacity={isBookmarked ? 1 : 0.2}
            color={'white'}
          />
        </div>
      )
    }
    onClick={(event) => {
      event.stopPropagation();
      loadingBookmarks ? undefined : () => handleBookmarks();
    }}
  />
);

const MenuButton = ({
  showMenu,
  setShowMenu,
  post,
  repost,
}: {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  repost?: PostView;
}) => (
  <div className="relative cursor-default" onClick={(event) => event.stopPropagation()}>
    {showMenu && (
      <Tooltip.Menu post={post} repost={repost} setShowMenu={setShowMenu} />
    )}
    <Button.Action
      id="menu-btn"
      size="small"
      variant="custom"
      icon={
        <div>
          <Icon.DotsThreeOutline size="16" color="white" />
        </div>
      }
      onClick={(event) => {
        event.stopPropagation();
        setShowMenu(!showMenu);
      }}
    />
  </div>
);

export default function Actions({
  post,
  repost,
  deleteRepost = false,
  setShowModalTag,
}: PostProps) {
  const { pubky } = usePubkyClientContext();
  const { data: author } = useUserProfile(post?.details?.author, pubky ?? '');
  const { data: authorRepost } = useUserProfile(
    repost?.details?.author ?? '',
    pubky ?? '',
  );
  const { addBookmark, deleteBookmark } = usePubkyClientContext();
  const { addToast } = useToastContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showModalReply, setShowModalReply] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(
    repost?.bookmark?.id ? repost?.bookmark?.id : (post?.bookmark?.id ?? ''),
  );

  const handleAddBookmark = async (postId: string, authorId: string) => {
    try {
      setLoadingBookmarks(true);
      const result = await addBookmark(postId, authorId);
      if (result) setIsBookmarked(String(result));
      setLoadingBookmarks(false);
    } catch (error) {
      console.log(error);
      setLoadingBookmarks(false);
    }
  };

  const handleDeleteBookmark = async (
    postId: string,
    authorId: string,
    bookmarkId: string,
  ) => {
    try {
      setLoadingBookmarks(true);
      const result = await deleteBookmark(postId, authorId, bookmarkId);
      if (result) setIsBookmarked('');
      setLoadingBookmarks(false);
    } catch (error) {
      console.log(error);
      setLoadingBookmarks(false);
    }
  };

  const handleBookmarks = async () => {
    if (repost) {
      if (isBookmarked) {
        await handleDeleteBookmark(
          repost.details.id,
          repost.details.author,
          repost?.bookmark?.id ?? isBookmarked,
        );
      } else {
        await handleAddBookmark(repost?.details?.id, repost?.details?.author);
      }
    } else {
      if (isBookmarked) {
        await handleDeleteBookmark(
          post.details.id,
          post.details.author,
          post?.bookmark?.id ?? isBookmarked,
        );
      } else {
        await handleAddBookmark(post?.details?.id, post?.details?.author);
      }
    }

    if (!isBookmarked) {
      addToast(
        `This post by ${
          repost ? authorRepost?.details?.name : author?.details?.name
        } was saved to your bookmarks.`,
        'bookmark',
      );
    }
  };

  return (
    <div className="mt-6">
      <PostUI.Actions>
        <Button.Action
          id="mobile-tag-btn"
          size="small"
          variant="custom"
          className="md:hidden"
          onClick={(event) => {
            event.stopPropagation();
            setShowModalTag(true);
          }}
          icon={
            <div>
              <Icon.Tag size="16" />
            </div>
          }
          counter={post?.tags?.length}
        />
        <Button.Action
          id="reply-btn"
          size="small"
          variant="custom"
          icon={
            <div>
              <Icon.ChatCircleText size="16" />
            </div>
          }
          counter={post?.counts?.replies}
          onClick={(event) => {
            event.stopPropagation();
            setShowModalReply(true);
          }}
        />
        <div className="relative">
          <Button.Action
            id="repost-btn"
            size="small"
            variant="custom"
            icon={
              <div>
                <Icon.Repost
                  size="16"
                  color={deleteRepost ? '#00BA7C' : 'white'}
                />
              </div>
            }
            counter={post?.counts?.reposts}
            onClick={(event) => {
              event.stopPropagation();
              setShowModalRepost(true);
            }}
          />
        </div>
        <BookmarkButton
          isBookmarked={isBookmarked}
          loadingBookmarks={loadingBookmarks}
          handleBookmarks={handleBookmarks}
        />
        <MenuButton
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          post={post}
          repost={repost}
        />
      </PostUI.Actions>
      <div
        className="cursor-default"
        onClick={(event) => event.stopPropagation()}
      >
        <Modal.Repost
          post={post}
          showModalRepost={showModalRepost}
          setShowModalRepost={setShowModalRepost}
        />
        <Modal.CreateReply
          post={post}
          showModalReply={showModalReply}
          setShowModalReply={setShowModalReply}
        />
      </div>
    </div>
  );
}
