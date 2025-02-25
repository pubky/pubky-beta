'use client';

import { BottomSheet } from '@social/ui-shared';
import { UserTags, UserView } from '@/types/User';
import ContentProfileTag from '../Modal/_TagProfile/_Content';

interface TagProfileProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  profileTags: UserTags[];
  setProfileTags: React.Dispatch<React.SetStateAction<UserTags[]>>;
  pubkyUser?: string;
  user?: UserView | null;
  title?: string;
  className?: string;
}

export default function TagProfile({
  show,
  setShow,
  profileTags,
  setProfileTags,
  pubkyUser,
  user,
  title,
  className,
}: TagProfileProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? `Tag ${user?.details?.name}`}
      className={className}
    >
      <ContentProfileTag
        profileTags={profileTags}
        setProfileTags={setProfileTags}
        pubkyUser={pubkyUser}
        user={user}
      />
    </BottomSheet.Root>
  );
}
