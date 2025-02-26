'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentTag from '../Modal/_Tag/_Content';

interface TagProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function Tag({ show, setShow, post, title, className }: TagProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Tag Post'} className={className}>
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <ContentTag post={post} />
      </div>
    </BottomSheet.Root>
  );
}
