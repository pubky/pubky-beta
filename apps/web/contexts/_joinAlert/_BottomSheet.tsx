'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentJoin from './_Content';

interface BottomSheetJoinProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function BottomSheetJoin({
  show,
  setShow,
  title,
  className,
}: BottomSheetJoinProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Join Pubky'}
      className={className}
    >
      <ContentJoin closeJoin={() => setShow(false)} />
    </BottomSheet.Root>
  );
}
