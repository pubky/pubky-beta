import { PostView } from '@/types/Post';

// Utility function to group reposts of the same post within a batch of posts
export const groupReposts = (posts: PostView[]): PostView[] => {
  const batchSize = 10;
  const result: PostView[] = [];

  // Process posts in batches of 10
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const repostGroups = new Map<string, PostView[]>();
    const nonRepostPosts: PostView[] = [];

    // Separate reposts from regular posts within this batch
    batch.forEach((post) => {
      if (post.relationships?.reposted && !post.details.content && !post.details.attachments?.length) {
        const repostedUri = post.relationships.reposted;
        if (!repostGroups.has(repostedUri)) {
          repostGroups.set(repostedUri, []);
        }
        repostGroups.get(repostedUri)!.push(post);
      } else {
        nonRepostPosts.push(post);
      }
    });

    // Create grouped repost entries for this batch
    const groupedPosts: PostView[] = [];

    repostGroups.forEach((reposts, repostedUri) => {
      if (reposts.length === 1) {
        // Single repost, keep as is
        groupedPosts.push(reposts[0]);
      } else {
        // Multiple reposts of the same post within this batch, create a grouped entry
        // Sort reposts by indexed_at to find the earliest one
        const sortedReposts = [...reposts].sort((a, b) => a.details.indexed_at - b.details.indexed_at);
        const earliestRepost = sortedReposts[0];

        // Check if any of the reposts is already a grouped repost
        const existingGroupedRepost = reposts.find((r) => r.groupedReposts);

        if (existingGroupedRepost) {
          // Use the existing grouped repost structure but update with new reposts
          const allReposts = [...new Set([...(existingGroupedRepost.groupedReposts || []), ...reposts])];
          // Find the earliest timestamp among all reposts
          const earliestTimestamp = Math.min(...allReposts.map((r) => r.details.indexed_at));

          const groupedRepost: PostView = {
            ...existingGroupedRepost,
            details: {
              ...existingGroupedRepost.details,
              id: existingGroupedRepost.details.id.startsWith('grouped-')
                ? existingGroupedRepost.details.id
                : `grouped-${repostedUri}-${i}`,
              indexed_at: earliestTimestamp // Use the earliest timestamp
            },
            groupedReposts: allReposts,
            repostCount: allReposts.length,
            uniqueReposters: [...new Set(allReposts.map((r) => r.details.author))]
          };
          groupedPosts.push(groupedRepost);
        } else {
          // Create a new grouped repost using the earliest repost as base
          const groupedRepost: PostView = {
            ...earliestRepost,
            details: {
              ...earliestRepost.details,
              id: `grouped-${repostedUri}-${i}`, // Create a unique ID for the grouped repost with batch index
              content: '', // Empty content to indicate it's a grouped repost
              indexed_at: earliestRepost.details.indexed_at // Keep the earliest timestamp
            },
            // Add metadata for grouped reposts
            groupedReposts: reposts,
            repostCount: reposts.length,
            uniqueReposters: [...new Set(reposts.map((r) => r.details.author))]
          };
          groupedPosts.push(groupedRepost);
        }
      }
    });

    // Add grouped posts and non-repost posts from this batch to result
    result.push(...groupedPosts, ...nonRepostPosts);
  }

  return result;
};
