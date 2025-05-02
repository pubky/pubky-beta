'use client';

import { useState } from 'react';
import { Icon, Button, Post as PostUI } from '@social/ui-shared';
import { useAlertContext, useModal, usePubkyClientContext, useToastContext } from '@/contexts';
import { PostType, PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';
import Tooltip from '../Tooltip';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  repost?: PostView;
  deleteRepost?: boolean;
  postType: PostType;
  showTags: boolean;
  setShowTags: (showTags: boolean) => void;
}

const BookmarkButton = ({
  isBookmarked,
  loadingBookmarks,
  handleBookmarks
}: {
  isBookmarked: string;
  loadingBookmarks: boolean;
  handleBookmarks: () => void;
}) => {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();

  return (
    <Button.Action
      id="bookmark-btn"
      size="small"
      variant="custom"
      disabled={loadingBookmarks}
      icon={
        loadingBookmarks ? (
          <div>
            <Icon.LoadingSpin size="19" />
          </div>
        ) : (
          <div>
            <Icon.BookmarkSimple size="19" opacity={isBookmarked ? 1 : 0.2} color={'white'} />
          </div>
        )
      }
      onClick={(event) => {
        event.stopPropagation();
        loadingBookmarks ? undefined : pubky ? handleBookmarks() : openModal('join');
      }}
    />
  );
};

const MenuButton = ({ post, repost }: { post: PostView; repost?: PostView }) => {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();
  const isMobile = useIsMobile();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative cursor-default" onClick={(event) => event.stopPropagation()}>
      {showMenu && <Tooltip.Menu post={post} repost={repost} setShowMenu={setShowMenu} />}
      <Button.Action
        id="menu-btn"
        size="small"
        variant="custom"
        icon={
          <div>
            <Icon.DotsThreeOutline size="19" color="white" />
          </div>
        }
        onClick={(event) => {
          event.stopPropagation();
          pubky
            ? isMobile
              ? openModal('menuPost', { post: post, repost: repost })
              : setShowMenu(!showMenu)
            : openModal('join');
        }}
      />
    </div>
  );
};

export default function Actions({ post, repost, deleteRepost = false, postType, showTags, setShowTags }: PostProps) {
  const { pubky } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { openModal } = useModal();
  const { data: author } = useUserProfile(post?.details?.author, pubky ?? '');
  const { data: authorRepost } = useUserProfile(repost?.details?.author ?? '', pubky ?? '');
  const { addBookmark, deleteBookmark } = usePubkyClientContext();
  const { addToast } = useToastContext();
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(
    repost?.bookmark?.id ? repost?.bookmark?.id : (post?.bookmark?.id ?? '')
  );

  const handleAddBookmark = async (postId: string, authorId: string) => {
    try {
      setLoadingBookmarks(true);
      const result = await addBookmark(postId, authorId);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      if (result) setIsBookmarked(String(result));
      setLoadingBookmarks(false);
    } catch (error) {
      console.log(error);
      setLoadingBookmarks(false);
    }
  };

  const handleDeleteBookmark = async (postId: string, authorId: string) => {
    try {
      setLoadingBookmarks(true);
      const result = await deleteBookmark(postId, authorId);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

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
        await handleDeleteBookmark(repost.details.id, repost.details.author);
      } else {
        await handleAddBookmark(repost?.details?.id, repost?.details?.author);
      }
    } else {
      if (isBookmarked) {
        await handleDeleteBookmark(post.details.id, post.details.author);
      } else {
        await handleAddBookmark(post?.details?.id, post?.details?.author);
      }
    }

    if (!isBookmarked) {
      addToast(
        <>
          This post by{' '}
          <span className="text-opacity-100 font-bold">
            {repost ? authorRepost?.details?.name : author?.details?.name}
          </span>{' '}
          was saved to your bookmarks.
        </>,
        'bookmark'
      );
    }
  };

  return (
    <div className="flex items-end mt-3">
      <PostUI.Actions>
        <Button.Action
          id="mobile-tag-btn"
          size="small"
          variant="custom"
          onClick={(event) => {
            event.stopPropagation();
            pubky ? setShowTags(!showTags) : openModal('join');
          }}
          icon={
            <div>
              <Icon.Tag size="19" />
            </div>
          }
          counter={post?.counts?.unique_tags}
        />
        <Button.Action
          id="reply-btn"
          size="small"
          variant="custom"
          icon={
            <div>
              <Icon.ChatCircleText size="19" />
            </div>
          }
          counter={post?.counts?.replies}
          onClick={(event) => {
            event.stopPropagation();
            pubky ? openModal('createReply', { post, postType }) : openModal('join');
          }}
        />
        <div className="relative">
          <Button.Action
            id="repost-btn"
            size="small"
            variant="custom"
            icon={
              <div>
                <Icon.Repost size="19" color={deleteRepost ? '#00BA7C' : 'white'} />
              </div>
            }
            counter={post?.counts?.reposts}
            onClick={(event) => {
              event.stopPropagation();
              pubky ? openModal('createRepost', { post }) : openModal('join');
            }}
          />
        </div>
        <BookmarkButton
          isBookmarked={isBookmarked}
          loadingBookmarks={loadingBookmarks}
          handleBookmarks={handleBookmarks}
        />
        <MenuButton post={post} repost={repost} />
      </PostUI.Actions>
    </div>
  );
}
