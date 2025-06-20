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
        const firstRepost = reposts[0];
        const groupedRepost: PostView = {
          ...firstRepost,
          details: {
            ...firstRepost.details,
            id: `grouped-${repostedUri}-${i}`, // Create a unique ID for the grouped repost with batch index
            content: '' // Empty content to indicate it's a grouped repost
          },
          // Add metadata for grouped reposts
          groupedReposts: reposts,
          repostCount: reposts.length,
          uniqueReposters: [...new Set(reposts.map((r) => r.details.author))]
        };
        groupedPosts.push(groupedRepost);
      }
    });

    // Add grouped posts and non-repost posts from this batch to result
    result.push(...groupedPosts, ...nonRepostPosts);
  }

  return result;
}; 