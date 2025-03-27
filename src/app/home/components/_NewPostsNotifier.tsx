'use client';

import { useEffect, useState } from 'react';
import { Button } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { getStreamPosts } from '@/services/streamService';

export function NewPostsNotifier() {
  const { timeline, setTimeline, pubky, deletedPosts, mutedUsers } = usePubkyClientContext();
  const { reach, sort, content, selectedFeed } = useFilterContext();

  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [latestTimestamp, setLatestTimestamp] = useState<number | undefined>(undefined);

  useEffect(() => {
    setNewPosts([]);
    setNewPostsCount(0);
    setLatestTimestamp(undefined);
  }, [sort, reach, content, selectedFeed?.tags]);

  // Update latestTimestamp whenever the timeline changes
  useEffect(() => {
    if (timeline.length > 0) {
      const maxIndexedAt = Math.max(...timeline.map((p) => p.details.indexed_at));
      setLatestTimestamp(maxIndexedAt);
    } else {
      setLatestTimestamp(null);
    }
  }, [timeline]);

  const fetchNewPosts = async () => {
    try {
      const newPostsValue = await getStreamPosts(
        pubky ?? '', // viewerId
        reach, // source
        undefined, // authorId
        10, // limit
        undefined, // end
        latestTimestamp ? latestTimestamp + 1 : undefined, // start
        0, // skip
        sort, // sort
        selectedFeed?.tags, // tags
        content // kind
      );
      // filter out deleted posts and muted users and order by indexed_at and reverse the order
      const filteredNewPosts = newPostsValue
        .filter((post) => !deletedPosts.includes(post.details.id) && !mutedUsers.includes(post.details.author))
        .sort((a, b) => b.details.indexed_at - a.details.indexed_at);

      setNewPosts([...newPosts, ...filteredNewPosts]);
      setNewPostsCount(filteredNewPosts.length + newPostsCount);

      // set latest timestamp to the latest post timestamp
      setLatestTimestamp(Math.max(...filteredNewPosts.map((p) => p.details.indexed_at)));
    } catch (error) {
      console.log('No new posts');
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchNewPosts, 10000);
    return () => clearInterval(interval);
  }, [latestTimestamp]);

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
