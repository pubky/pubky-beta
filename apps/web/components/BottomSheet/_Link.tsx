'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentLink from '../Modal/_Link/_Content';

interface LinkProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onAddLink: (title: string, url: string) => void;
  title?: string;
  className?: string;
}

export default function Link({
  show,
  setShow,
  onAddLink,
  title,
  className,
}: LinkProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Add Profile Link'}
      className={className}
    >
      <ContentLink setShowModalLink={setShow} onAddLink={onAddLink} />
    </BottomSheet.Root>
  );
}
