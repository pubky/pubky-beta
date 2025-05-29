import { Utils } from '@/components/utils-shared';
import { PostView } from '@/types/Post';

const censoredTags = process.env.NEXT_PUBLIC_MODERATED_TAGS
  ? JSON.parse(process.env.NEXT_PUBLIC_MODERATED_TAGS)
  : Utils.censoredTags;

const isCensored = (postToCheck: PostView) => {
  return postToCheck?.tags.some(
    (tag) => censoredTags.includes(tag.label) && tag.taggers[0] === process.env.NEXT_PUBLIC_MODERATION_ID
  );
};

export default isCensored;
