'use client';

import { BottomSheet } from '@social/ui-shared';
import { UserTags } from '@/types/User';
import ContentProfileTag from '../Modal/_TagProfile/_Content';

interface TagProfileProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  profileTags: UserTags[];
  handleAddProfileTag: (tag: string) => void;
  handleDeleteProfileTag: (tag: string) => void;
  selectedTag?: UserTags | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<UserTags | null>>;
  pubkyUser?: string;
  name?: string;
  uriImage?: string;
  title?: string;
  className?: string;
}

export default function TagProfile({
  show,
  setShow,
  profileTags,
  handleAddProfileTag,
  handleDeleteProfileTag,
  selectedTag,
  setSelectedTag,
  pubkyUser,
  name,
  uriImage,
  title,
  className,
}: TagProfileProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? `Tag ${name}`}
      className={className}
    >
      <ContentProfileTag
        profileTags={profileTags}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={pubkyUser}
        name={name}
        uriImage={uriImage}
      />
    </BottomSheet.Root>
  );
}
