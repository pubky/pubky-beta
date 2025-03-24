'use client';

import { useEffect, useState } from 'react';
import { Button } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useStreamPost } from '@/hooks/useStream';
import { ICustomFeed } from '@/types';

export function NewPostsNotifier({ selectedFeed }: { selectedFeed: ICustomFeed | undefined }) {
  const { timeline, setTimeline, pubky, deletedPosts } = usePubkyClientContext();

  const { reach, sort, content } = useFilterContext();
  const tagsFeed = selectedFeed?.tags;

  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [latestTimestamp, setLatestTimestamp] = useState<number | null>(null);

  useEffect(() => {
    setNewPosts([]);
    setNewPostsCount(0);
    setLatestTimestamp(null);
    // setShouldFetch(false);
  }, [sort, reach, content]);

  // Update latestTimestamp whenever the timeline changes
  useEffect(() => {
    if (timeline.length > 0) {
      const maxIndexedAt = Math.max(...timeline.map((p) => p.details.indexed_at));
      setLatestTimestamp(maxIndexedAt);
    } else {
      setLatestTimestamp(null);
    }
  }, [timeline]);

  // Query: fetch posts newer than the latestTimestamp
  const { data: newPostsData } = useStreamPost(
    pubky ?? '', // viewerId
    reach, // source
    undefined, // authorId
    10, // limit
    undefined, // start
    latestTimestamp ? latestTimestamp + 1 : undefined, // end
    sort === 'popularity' ? 0 : undefined, // skip
    sort, // sort
    tagsFeed, // tags
    content, // kind
    {
      refetchInterval: 10000
    }
  );

  // Process new data
  useEffect(() => {
    if (!newPostsData || !Array.isArray(newPostsData)) return;

    if (newPostsData.length > 0) {
      const filtered = newPostsData.filter(
        (post: PostView) =>
          !timeline.some((p) => p.details.id === post.details.id) &&
          !newPosts.some((p) => p.details.id === post.details.id) &&
          !deletedPosts.includes(post.details.id)
      );

      if (filtered.length > 0) {
        setNewPosts((prev) => [...prev, ...filtered]);
        setNewPostsCount((prev) => prev + filtered.length);

        const newMaxTimestamp = Math.max(...filtered.map((p) => p.details.indexed_at));
        setLatestTimestamp((prev) => {
          if (prev === null) return newMaxTimestamp;
          return Math.max(prev, newMaxTimestamp);
        });
      }
    }
  }, [newPostsData, newPosts, timeline]);

  // Handler to merge new posts into the main timeline
  const handleShowNewPosts = () => {
    setTimeline((prev) => [...newPosts, ...prev]);
    setNewPosts([]);
    setNewPostsCount(0);
  };

  return (
    <>
      {newPostsCount > 0 && (
        <Button.Medium id="show-new-posts-button" className="new-posts-button" onClick={handleShowNewPosts}>
          Show {newPostsCount} new {newPostsCount > 1 ? 'posts' : 'post'}
        </Button.Medium>
      )}
    </>
  );
}
