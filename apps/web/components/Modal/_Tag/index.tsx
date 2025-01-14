'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@social/ui-shared';
import { PostTag, PostView } from '@/types/Post';
import Post from '@/components/Post';
import ContentTag from './_Content';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  tags: PostTag[];
  post: PostView;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  updatePostInTimeline: (updatedPost: PostView) => void;
  selectedTag?: PostTag | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
}

export default function Tag({
  showModalTag,
  setShowModalTag,
  tags,
  post,
  handleAddTag,
  handleDeleteTag,
  updatePostInTimeline,
  selectedTag,
  setSelectedTag,
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
        //setTag('');
        setTagsError(false);
      }}
      className="w-full md:w-[792px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        id="close-btn"
        onClick={() => {
          setShowModalTag(false);
          //setTag('');
          setTagsError(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title="Tag Post" />
        <Modal.Content className="flex flex-row w-full">
          <ContentTag
            setShowModalTag={setShowModalTag}
            tags={tags}
            post={post}
            handleAddTag={handleAddTag}
            handleDeleteTag={handleDeleteTag}
            updatePostInTimeline={updatePostInTimeline}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tagsError={tagsError}
          />
        </Modal.Content>
        {post && (
          <div>
            <Post post={post} repostView />
          </div>
        )}
      </div>
    </Modal.Root>
  );
}
