'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostTag, PostView } from '@/types/Post';
import ContentTag from '../Modal/_Tag/_Content';

interface TagProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
  tags: PostTag[];
  post: PostView;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  updatePostInTimeline: (updatedPost: PostView) => void;
  selectedTag?: PostTag | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
}

export default function Tag({
  show,
  setShow,
  title,
  className,
  tags,
  post,
  handleAddTag,
  handleDeleteTag,
  updatePostInTimeline,
  selectedTag,
  setSelectedTag,
}: TagProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Tag Post'}
      className={className}
    >
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <ContentTag
          setShowModalTag={setShow}
          tags={tags}
          post={post}
          handleAddTag={handleAddTag}
          handleDeleteTag={handleDeleteTag}
          updatePostInTimeline={updatePostInTimeline}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </div>
    </BottomSheet.Root>
  );
}
