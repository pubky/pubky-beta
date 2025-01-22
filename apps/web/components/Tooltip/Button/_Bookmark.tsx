import { Icon, Tooltip } from '@social/ui-shared';
import {
  useAlertContext,
  usePubkyClientContext,
  useToastContext,
} from '@/contexts';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';

interface BookmarkProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView | undefined;
}

export default function Bookmark({ post, repost, setShowMenu }: BookmarkProps) {
  const { pubky, addBookmark, deleteBookmark } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { addToast } = useToastContext();
  const { data: author } = useUserProfile(post?.details?.author, pubky ?? '');

  const handleAddBookmark = async (postId: string, uri: string) => {
    const result = await addBookmark(postId, uri);

    if (!result) {
      addAlert('Something went wrong!', 'warning');
    }

    if (result) setShowMenu(false);
  };

  const handleDeleteBookmark = async (
    postId: string,
    authorId: string,
    bookmarkId: string,
  ) => {
    const result = await deleteBookmark(postId, authorId, bookmarkId);

    if (!result) {
      addAlert('Something went wrong!', 'warning');
    }

    if (result) setShowMenu(false);
  };

  const handleBookmarks = (
    repost: PostView | undefined,
    post: PostView,
    handleAddBookmark: (postId: string, authorId: string) => Promise<void>,
    handleDeleteBookmark: (
      postId: string,
      authorId: string,
      bookmarkId: string,
    ) => Promise<void>,
    addToast: (
      content: React.ReactNode,
      variant?: 'bookmark' | 'pubky' | 'link',
    ) => void,
  ) => {
    const isBookmarked = repost ? repost.bookmark?.id : post?.bookmark?.id;

    if (repost) {
      if (isBookmarked) {
        handleDeleteBookmark(
          repost.details?.id,
          repost.details.author,
          repost?.bookmark?.id ?? '',
        );
      } else {
        handleAddBookmark(repost?.details?.id, repost?.details?.author);
      }
    } else if (post) {
      if (isBookmarked) {
        handleDeleteBookmark(
          post.details?.id,
          post.details.author,
          post?.bookmark?.id ?? '',
        );
      } else {
        handleAddBookmark(post?.details?.id, post?.details?.author);
      }
    }

    if (!isBookmarked) {
      addToast(
        `This post by ${author?.details?.name} was saved to your bookmarks.`,
        'bookmark',
      );
    }
  };

  return (
    <Tooltip.Item
      id="add-bookmark"
      icon={
        <Icon.BookmarkSimple
          size="24"
          opacity={repost?.bookmark?.id ? 1 : post?.bookmark?.id ? 1 : 0.2}
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
          addToast,
        )
      }
    >
      {repost?.bookmark?.id
        ? 'Remove Bookmark'
        : post?.bookmark?.id
          ? 'Remove Bookmark'
          : 'Add Bookmark'}
    </Tooltip.Item>
  );
}
