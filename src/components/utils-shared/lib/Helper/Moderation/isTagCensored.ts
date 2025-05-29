import { PostTag } from '@/types/Post';
import { censoredTags } from './censoredTags';

const censoredTagsList = process.env.NEXT_PUBLIC_MODERATED_TAGS
  ? JSON.parse(process.env.NEXT_PUBLIC_MODERATED_TAGS)
  : censoredTags;

const isTagCensored = (tag: PostTag) => {
  return censoredTagsList.includes(tag.label) && tag.taggers[0] === process.env.NEXT_PUBLIC_MODERATION_ID;
};

export default isTagCensored;
