'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@social/ui-shared';
import ContentTagCreatePost from './_Content';
interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagCreatePost({
  showModalTag,
  setShowModalTag,
  arrayTags,
  setArrayTags,
}: TagProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);
  const [tagsError, setTagsError] = useState(false);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModalTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalTagRef, setShowModalTag]);

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModalTag}
      closeModal={() => {
        setShowModalTag(false);
        setTagsError(false);
      }}
      className="w-full"
    >
      <Modal.CloseAction
        id="close-btn"
        onClick={() => {
          setShowModalTag(false);
          setTagsError(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title="Tag" />
        <Modal.Content className="flex flex-row md:w-[350px]">
          <ContentTagCreatePost
            arrayTags={arrayTags}
            setArrayTags={setArrayTags}
            tagsError={tagsError}
            setTagsError={setTagsError}
          />
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
