import { PostView } from '@/types/Post';
import { censoredTags } from './censoredTags';

const censoredTagsList = process.env.NEXT_PUBLIC_MODERATED_TAGS
  ? JSON.parse(process.env.NEXT_PUBLIC_MODERATED_TAGS)
  : censoredTags;

const isCensored = (postToCheck: PostView) => {
  return postToCheck?.tags.some(
    (tag) => censoredTagsList.includes(tag.label) && tag.taggers.includes(process.env.NEXT_PUBLIC_MODERATION_ID)
  );
};

export default isCensored;
