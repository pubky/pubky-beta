'use client';

import { useEffect, useRef } from 'react';
import { Modal } from '@social/ui-shared';
import { UserTags } from '@/types/User';
import ContentProfileTag from './_Content';

interface ProfileTagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalProfileTag: boolean;
  setShowModalProfileTag: React.Dispatch<React.SetStateAction<boolean>>;
  profileTags: UserTags[];
  handleAddProfileTag: (tag: string) => void;
  handleDeleteProfileTag: (tag: string) => void;
  selectedTag?: UserTags | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<UserTags | null>>;
  pubkyUser?: string;
  name?: string;
  uriImage?: string;
}

export default function ProfileTag({
  showModalProfileTag,
  setShowModalProfileTag,
  profileTags,
  handleAddProfileTag,
  handleDeleteProfileTag,
  selectedTag,
  setSelectedTag,
  pubkyUser,
  name,
  uriImage,
}: ProfileTagProps) {
  const modalProfileTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalProfileTagRef.current &&
        !modalProfileTagRef.current.contains(event.target as Node)
      ) {
        setShowModalProfileTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalProfileTagRef, setShowModalProfileTag]);

  return (
    <Modal.Root
      modalRef={modalProfileTagRef}
      show={showModalProfileTag}
      closeModal={() => {
        setShowModalProfileTag(false);
      }}
      className="md:w-[792px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalProfileTag(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title={`Tag ${name}`} />
        <Modal.Content className="w-full flex flex-row">
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
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
