'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentCreateRepost from '../Modal/_CreateRepost/_Content';
import { PostView } from '@/types/Post';

interface CreateRepostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function CreateRepost({
  show,
  setShow,
  post,
  title,
  className,
}: CreateRepostProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Repost'}
      className={className}
    >
      <ContentCreateRepost setShowModalRepost={setShow} post={post} />
    </BottomSheet.Root>
  );
}
