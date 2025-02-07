'use client';

import { ICustomFeed } from '@/types';
import { BottomSheet } from '@social/ui-shared';
import ContentCreateFeed from '../Modal/_CreateFeed/_Content';

interface CreateFeedProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setTagsFeed: React.Dispatch<React.SetStateAction<string[]>>;
  tagsFeed: string[];
  setNameFeed: React.Dispatch<React.SetStateAction<string>>;
  nameFeed: string;
  handleAddFeed: (feedToAdd: ICustomFeed, name: string) => void;
  title?: string;
  className?: string;
}

export default function CreateFeed({
  show,
  setShow,
  setTagsFeed,
  tagsFeed,
  setNameFeed,
  nameFeed,
  handleAddFeed,
  title,
  className,
}: CreateFeedProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Create Feed'}
      className={className}
    >
      <ContentCreateFeed
        setShowModalCreateFeed={setShow}
        setTagsFeed={setTagsFeed}
        tagsFeed={tagsFeed}
        setNameFeed={setNameFeed}
        nameFeed={nameFeed}
        handleAddFeed={handleAddFeed}
      />
    </BottomSheet.Root>
  );
}
