'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentJoin from '../Modal/_Join/_Content';

interface BottomSheetJoinProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function Join({ show, setShow, title, className }: BottomSheetJoinProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Join Pubky'} className={className}>
      <ContentJoin closeJoin={() => setShow(false)} />
    </BottomSheet.Root>
  );
}
