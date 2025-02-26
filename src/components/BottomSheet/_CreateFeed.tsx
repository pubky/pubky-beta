'use client';

import { ICustomFeed } from '@/types';
import { BottomSheet } from '@social/ui-shared';
import ContentCreateFeed from '../Modal/_CreateFeed/_Content';

interface CreateFeedProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoadFeeds: (feedToAdd: ICustomFeed, name: string) => void;
  title?: string;
  className?: string;
}

export default function CreateFeed({ show, setShow, handleLoadFeeds, title, className }: CreateFeedProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Create Feed'} className={className}>
      <ContentCreateFeed setShowModalCreateFeed={setShow} handleLoadFeeds={handleLoadFeeds} />
    </BottomSheet.Root>
  );
}
