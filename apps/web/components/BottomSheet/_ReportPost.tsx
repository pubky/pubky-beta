'use client';

import { PostView } from '@/types/Post';
import { BottomSheet } from '@social/ui-shared';
import ContentReportPost from '../Modal/_ReportPost/components/_Content';

interface ReportPostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function ReportPost({
  show,
  setShow,
  post,
  title,
  className,
}: ReportPostProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentReportPost setShowModal={setShow} post={post} />
    </BottomSheet.Root>
  );
}
