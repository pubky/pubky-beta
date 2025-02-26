'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentFeedback from '../Modal/_Feedback/_Content';

interface FeedbackProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function Feedback({ show, setShow, title, className }: FeedbackProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
      <ContentFeedback setShowModal={setShow} />
    </BottomSheet.Root>
  );
}
