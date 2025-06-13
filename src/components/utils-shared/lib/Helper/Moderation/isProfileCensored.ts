import { UserView } from '@/types/User';
import { censoredTags } from './censoredTags';

const censoredTagsList = process.env.NEXT_PUBLIC_MODERATED_TAGS
  ? JSON.parse(process.env.NEXT_PUBLIC_MODERATED_TAGS)
  : censoredTags;

const isCensored = (profileToCheck: UserView) => {
  return profileToCheck?.tags?.some(
    (tag) => censoredTagsList.includes(tag.label) && tag.taggers.includes(process.env.NEXT_PUBLIC_MODERATION_ID)
  );
};

export default isCensored;
