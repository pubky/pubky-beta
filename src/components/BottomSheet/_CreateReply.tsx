'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentCreateReply from '../Modal/_CreateReply/_Content';

interface CreateReplyProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function CreateReply({ show, setShow, post, title, className }: CreateReplyProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Reply'} className={className}>
      <ContentCreateReply className="p-0 border-none" setShowModalReply={setShow} post={post} />
    </BottomSheet.Root>
  );
}
