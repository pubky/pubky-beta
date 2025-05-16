import { ICustomFeed } from '@/types';

export const checkDuplicateName = (existingFeeds: any[], nameFeed: string, feedName?: string) => {
  // If feedName is provided, we're in edit mode
  if (feedName) {
    return existingFeeds.some((existingFeed) => existingFeed.name === nameFeed && existingFeed.name !== feedName);
  }
  // Otherwise we're in create mode
  return existingFeeds.some((existingFeed) => existingFeed.name === nameFeed);
};

export const checkDuplicateContent = (existingFeeds: any[], updatedFeed: ICustomFeed, feedName?: string) => {
  const isDuplicateContent = existingFeeds.some((existingFeed) => {
    // Skip comparing with the feed being edited by checking the name
    if (feedName && existingFeed.name === feedName) {
      return false;
    }

    const feedContent = JSON.stringify({
      tags: existingFeed.feed.tags,
      reach: existingFeed.feed.reach,
      layout: existingFeed.feed.layout,
      sort: existingFeed.feed.sort,
      content: existingFeed.feed.content || 'all' // Default to 'all' if content is missing
    });
    const newFeedContent = JSON.stringify({
      tags: updatedFeed.tags,
      reach: updatedFeed.reach,
      layout: updatedFeed.layout,
      sort: updatedFeed.sort,
      content: updatedFeed.content
    });
    return feedContent === newFeedContent;
  });

  if (isDuplicateContent) {
    return existingFeeds.find((existingFeed) => {
      // Skip comparing with the feed being edited by checking the name
      if (feedName && existingFeed.name === feedName) {
        return false;
      }

      const feedContent = JSON.stringify({
        tags: existingFeed.feed.tags,
        reach: existingFeed.feed.reach,
        layout: existingFeed.feed.layout,
        sort: existingFeed.feed.sort,
        content: existingFeed.feed.content || 'all' // Default to 'all' if content is missing
      });
      const newFeedContent = JSON.stringify({
        tags: updatedFeed.tags,
        reach: updatedFeed.reach,
        layout: updatedFeed.layout,
        sort: updatedFeed.sort,
        content: updatedFeed.content
      });
      return feedContent === newFeedContent;
    });
  }

  return null;
};

export const handleAddTag = (
  tag: string,
  tagsFeed: string[],
  setTagsFeed: (tags: string[]) => void,
  setTag: (tag: string) => void,
  setTagsError: (error: boolean) => void
) => {
  // check if the tag is already in the array
  if (tagsFeed?.includes(tag.trim())) {
    return;
  }

  if (tagsFeed.length > 5) {
    setTagsError(true);
  } else {
    const trimmedTag = tag.trim();
    if (trimmedTag !== '' && !tagsFeed.includes(trimmedTag)) {
      setTagsFeed([...tagsFeed, trimmedTag]);
      setTag('');
    }
  }
};

export const handleRemoveTag = (
  indexToRemove: number,
  tagsFeed: string[],
  setTagsFeed: (tags: string[]) => void,
  setTagsError: (error: boolean) => void
) => {
  tagsFeed && setTagsFeed(tagsFeed.filter((_, index) => index !== indexToRemove));
  if (tagsFeed && tagsFeed.length < 5) {
    setTagsError(false);
  }
};
