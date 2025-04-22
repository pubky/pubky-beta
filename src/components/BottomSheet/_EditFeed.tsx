'use client';

import { ICustomFeed } from '@/types';
import { BottomSheet } from '@social/ui-shared';
import ContentEditFeed from '../Modal/_EditFeed/_Content';

interface EditFeedProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateFeeds: (feedToAdd: ICustomFeed, name: string) => void;
  feedToEdit: ICustomFeed;
  feedName: string;
  title?: string;
  className?: string;
}

export default function EditFeed({
  show,
  setShow,
  handleUpdateFeeds,
  feedToEdit,
  feedName,
  title,
  className
}: EditFeedProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Edit Feed'} className={className}>
      <ContentEditFeed
        setShowModalEditFeed={setShow}
        handleUpdateFeeds={handleUpdateFeeds}
        feedToEdit={feedToEdit}
        feedName={feedName}
      />
    </BottomSheet.Root>
  );
}
