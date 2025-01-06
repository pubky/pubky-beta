'use client';

import { BottomSheet } from '@social/ui-shared';
import { useState } from 'react';
import ContentTagCreatePost from '../Modal/_TagCreatePost/_Content';

interface TagCreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagCreatePost({
  show,
  setShow,
  title,
  className,
  arrayTags,
  setArrayTags,
}: TagCreatePostProps) {
  const [tagsError, setTagsError] = useState(false);

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Tag'}
      className={className}
    >
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <ContentTagCreatePost
          arrayTags={arrayTags}
          setArrayTags={setArrayTags}
          tagsError={tagsError}
          setTagsError={setTagsError}
        />
      </div>
    </BottomSheet.Root>
  );
}
