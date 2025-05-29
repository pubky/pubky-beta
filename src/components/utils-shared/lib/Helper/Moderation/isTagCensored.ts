import { Utils } from '@/components/utils-shared';
import { PostTag } from '@/types/Post';

const censoredTags = process.env.NEXT_PUBLIC_MODERATED_TAGS
  ? JSON.parse(process.env.NEXT_PUBLIC_MODERATED_TAGS)
  : Utils.censoredTags;

const isTagCensored = (tag: PostTag) => {
  return censoredTags.includes(tag.label) && tag.taggers[0] === process.env.NEXT_PUBLIC_MODERATION_ID;
};

export default isTagCensored;
