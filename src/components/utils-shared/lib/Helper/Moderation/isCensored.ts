import { Utils } from '@/components/utils-shared';
import { PostView } from '@/types/Post';

const isCensored = (postToCheck: PostView) => {
  return postToCheck?.tags.some(
    (tag) => Utils.censoredTags.includes(tag.label) && tag.taggers[0] === process.env.NEXT_PUBLIC_MODERATION_ID
  );
};

export default isCensored;
