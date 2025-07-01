'use client';

import { useEffect, useState } from 'react';
import { Button } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { getStreamPosts } from '@/services/streamService';
import { groupReposts } from '@/utils/postUtils';

export function NewPostsNotifier() {
  const { timeline, setTimeline, pubky, deletedPosts, mutedUsers } = usePubkyClientContext();
  const { reach, sort, content, selectedFeed } = useFilterContext();

  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [latestTimestamp, setLatestTimestamp] = useState<number | undefined>(undefined);

  // Reset state when filters change
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
      setLatestTimestamp(undefined);
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

      // filter out deleted posts and muted users
      const filteredNewPosts = newPostsValue
        .filter((post) => !deletedPosts.includes(post.details.id) && !mutedUsers.includes(post.details.author))
        .sort((a, b) => (sort === 'recent' ? b.details.indexed_at - a.details.indexed_at : 0));

      // Only add posts that are not already in the timeline
      const uniqueNewPosts = filteredNewPosts.filter(
        (post) => !timeline.some((existingPost) => existingPost.details.id === post.details.id)
      );

      if (uniqueNewPosts.length > 0) {
        // Ensure no duplicates in newPosts array
        setNewPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.details.id));
          const trulyUniquePosts = uniqueNewPosts.filter((post) => !existingIds.has(post.details.id));
          const allNewPosts = [...prev, ...trulyUniquePosts];

          // Group the posts to get the actual count that will be displayed
          const groupedPosts = groupReposts(allNewPosts);

          // Create a set of reposted URIs that are already in the timeline
          const timelineRepostedUris = new Set<string>();
          timeline.forEach((post) => {
            if (post.relationships?.reposted) {
              timelineRepostedUris.add(post.relationships.reposted);
            }
            // Also check grouped reposts in timeline
            if (post.groupedReposts) {
              post.groupedReposts.forEach((groupedPost) => {
                if (groupedPost.relationships?.reposted) {
                  timelineRepostedUris.add(groupedPost.relationships.reposted);
                }
              });
            }
          });

          // Filter out grouped posts that are reposts of content already in timeline
          const newGroupedPosts = groupedPosts.filter((post) => {
            // If it's a regular post (not a repost), check if ID exists in timeline
            if (!post.relationships?.reposted) {
              return !timeline.some((timelinePost) => timelinePost.details.id === post.details.id);
            }

            // If it's a repost, check if the reposted content is already in timeline
            return !timelineRepostedUris.has(post.relationships.reposted);
          });

          setNewPostsCount(newGroupedPosts.length);
          return allNewPosts;
        });

        setLatestTimestamp(Math.max(...uniqueNewPosts.map((p) => p.details.indexed_at)));
      }
    } catch (error) {
      // console.log('No new posts');
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchNewPosts, 10000);
    return () => clearInterval(interval);
  }, [latestTimestamp]);

  // Handler to merge new posts into the main timeline
  const handleShowNewPosts = () => {
    setTimeline((prev) => {
      const existingIds = new Set(prev.map((p) => p.details.id));
      const uniqueNewPosts = newPosts.filter((post) => !existingIds.has(post.details.id));

      // Combine new posts with existing timeline
      const combinedTimeline = [...uniqueNewPosts.reverse(), ...prev];

      // Group reposts and sort based on current sort setting
      const groupedTimeline = groupReposts(combinedTimeline);
      const sortedTimeline =
        sort === 'recent'
          ? groupedTimeline.sort((a, b) => b.details.indexed_at - a.details.indexed_at)
          : groupedTimeline;

      return sortedTimeline;
    });
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
