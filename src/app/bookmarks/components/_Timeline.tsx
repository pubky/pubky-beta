'use client';

import { useEffect, useState } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { useAlertContext, useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useIsMobile } from '@/hooks/useIsMobile';
import Link from 'next/link';
import Image from 'next/image';

export const Timeline = () => {
  const limit = 10;
  const { pubky, addBookmark, deleteBookmark } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);
  const [skip, setSkip] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const isMobile = useIsMobile(1280);
  const { sort, layout, content } = useFilterContext();
  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    'bookmarks',
    undefined,
    limit,
    sort === 'recent' ? start : undefined,
    undefined,
    sort === 'popularity' ? skip : undefined,
    sort,
    undefined,
    content
  );
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState('');

  const fetchPosts = async () => {
    if (fetching || !data) return;
    setFetching(true);

    try {
      if (!Array.isArray(data) || data.length === 0) {
        setFetching(false);
        return;
      }

      const lastPost = data[data.length - 1] as PostView;

      if (sort === 'recent') {
        if (lastPost.bookmark?.indexed_at) {
          setStart(lastPost.bookmark.indexed_at - 1);
        }
      } else if (sort === 'popularity') {
        setSkip((prev) => prev + limit);
      }

      setTimeline((prev) => {
        const newPosts = data.filter((post: PostView) => !prev.some((p) => p.bookmark?.id === post.bookmark?.id));
        return [...prev, ...newPosts];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    setStart(undefined);
    setSkip(0);
    setTimeline([]);
    setFetching(false);
    fetchPosts();
  }, [sort, content]);

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

  useEffect(() => {
    if (timeline.length > 0) {
      const bookmarkedPost = timeline.find((post) => post?.bookmark?.id);
      setIsBookmarked(bookmarkedPost?.bookmark?.id ?? '');
    }
  }, [timeline]);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <div key={post.details.id} className="flex flex-col">
          <div className="flex gap-2 items-center">
            <Post largeView={!isMobile && layout === 'wide'} key={`post-${post.details.id}`} post={post} />
            {post?.details?.content === '[DELETED]' && (
              <>
                {loadingBookmarks ? (
                  <Icon.LoadingSpin size="24" />
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      isBookmarked && post?.bookmark?.id
                        ? handleDeleteBookmark(post?.details?.id, post?.details?.author)
                        : handleAddBookmark(post?.details?.id, post?.details?.author)
                    }
                  >
                    <Icon.BookmarkSimple size="24" opacity={isBookmarked ? 1 : 0.2} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
      {!isLoading && !fetching && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Bookmarks size="48" color="#C8FF00" />}
          title="Save posts for later"
          description="Bookmark post to easily find them again in the future."
        >
          <div className="flex gap-3 z-10 justify-center flex-wrap">
            <Link href="/home">
              <Button.Medium icon={<Icon.NoteBlank size="16" />} className="whitespace-nowrap">
                Discover Posts
              </Button.Medium>
            </Link>
            <Link href="/hot#active">
              <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
                Follow Active Users
              </Button.Medium>
            </Link>
            <Link href="hot">
              <Button.Medium icon={<Icon.Tag size="16" />}>Explore Tags</Button.Medium>
            </Link>
          </div>
          <div className="absolute top-32 z-0">
            <Image alt="not-found-bookmarks" width={588} height={392} src="/images/webp/not-found/bookmarks.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
};
