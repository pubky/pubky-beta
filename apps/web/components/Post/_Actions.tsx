'use client';

import { useState } from 'react';
import { Icon, Button, Post as PostUI } from '@social/ui-shared';
import {
  useJoinModal,
  usePubkyClientContext,
  useToastContext,
} from '@/contexts';
import Tooltip from '../Tooltip';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';
import Modal from '../Modal';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BottomSheet } from '../BottomSheet';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  repost?: PostView;
  deleteRepost?: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSheetTag: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookmarkButton = ({
  isBookmarked,
  loadingBookmarks,
  handleBookmarks,
}: {
  isBookmarked: string;
  loadingBookmarks: boolean;
  handleBookmarks: () => void;
}) => {
  const { pubky } = usePubkyClientContext();
  const { openJoinModal } = useJoinModal();
  return (
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
        loadingBookmarks
          ? undefined
          : pubky
            ? handleBookmarks()
            : openJoinModal();
      }}
    />
  );
};

const MenuButton = ({
  showMenu,
  setShowMenu,
  showSheetMenu,
  setShowSheetMenu,
  post,
  repost,
}: {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showSheetMenu: boolean;
  setShowSheetMenu: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  repost?: PostView;
}) => {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const { openJoinModal } = useJoinModal();
  return (
    <div
      className="relative cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
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
          pubky
            ? isMobile
              ? setShowSheetMenu(true)
              : setShowMenu(!showMenu)
            : openJoinModal();
        }}
      />
      <BottomSheet.Menu
        post={post}
        repost={repost}
        show={showSheetMenu}
        setShow={setShowSheetMenu}
      />
    </div>
  );
};

export default function Actions({
  post,
  repost,
  deleteRepost = false,
  setShowModalTag,
  setShowSheetTag,
}: PostProps) {
  const { pubky } = usePubkyClientContext();
  const { openJoinModal } = useJoinModal();
  const isMobile = useIsMobile();
  const { data: author } = useUserProfile(post?.details?.author, pubky ?? '');
  const { data: authorRepost } = useUserProfile(
    repost?.details?.author ?? '',
    pubky ?? '',
  );
  const { addBookmark, deleteBookmark } = usePubkyClientContext();
  const { addToast } = useToastContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showSheetMenu, setShowSheetMenu] = useState(false);
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [showSheetRepost, setShowSheetRepost] = useState(false);
  const [showModalReply, setShowModalReply] = useState(false);
  const [showSheetReply, setShowSheetReply] = useState(false);
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
          onClick={(event) => {
            event.stopPropagation();
            pubky
              ? isMobile
                ? setShowSheetTag(true)
                : setShowModalTag(true)
              : openJoinModal();
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
            pubky
              ? isMobile
                ? setShowSheetReply(true)
                : setShowModalReply(true)
              : openJoinModal();
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
              pubky
                ? isMobile
                  ? setShowSheetRepost(true)
                  : setShowModalRepost(true)
                : openJoinModal();
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
          showSheetMenu={showSheetMenu}
          setShowSheetMenu={setShowSheetMenu}
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
        <BottomSheet.CreateRepost
          post={post}
          show={showSheetRepost}
          setShow={setShowSheetRepost}
        />
        <Modal.CreateReply
          post={post}
          showModalReply={showModalReply}
          setShowModalReply={setShowModalReply}
        />
        <BottomSheet.CreateReply
          post={post}
          show={showSheetReply}
          setShow={setShowSheetReply}
        />
      </div>
    </div>
  );
}
