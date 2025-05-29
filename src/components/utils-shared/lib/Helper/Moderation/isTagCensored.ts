import { Utils } from '@/components/utils-shared';
import { PostTag } from '@/types/Post';

const isTagCensored = (tag: PostTag) => {
  return Utils.censoredTags.includes(tag.label) && tag.taggers[0] === process.env.NEXT_PUBLIC_MODERATION_ID;
};

export default isTagCensored;
