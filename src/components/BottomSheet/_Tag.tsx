'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostType, PostView } from '@/types/Post';
import ContentTag from '../Modal/_Tag/_Content';

interface TagProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
  postType: PostType;
}

export default function Tag({ show, setShow, post, title, className, postType }: TagProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Tag Post'} className={className}>
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <ContentTag post={post} postType={postType} />
      </div>
    </BottomSheet.Root>
  );
}
