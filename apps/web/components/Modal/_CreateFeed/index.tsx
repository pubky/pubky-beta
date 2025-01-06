import { useEffect, useRef } from 'react';
import { ICustomFeed } from '@/types';
import { Modal } from '@social/ui-shared';
import ContentCreateFeed from './_Content';

interface CreateFeedProps {
  showModalCreateFeed: boolean;
  setShowModalCreateFeed: React.Dispatch<React.SetStateAction<boolean>>;
  setTagsFeed: React.Dispatch<React.SetStateAction<string[]>>;
  tagsFeed: string[];
  setNameFeed: React.Dispatch<React.SetStateAction<string>>;
  nameFeed: string;
  handleAddFeed: (feedToAdd: ICustomFeed, name: string) => void;
}

export default function CreateFeed({
  showModalCreateFeed,
  setShowModalCreateFeed,
  setTagsFeed,
  tagsFeed,
  setNameFeed,
  nameFeed,
  handleAddFeed,
}: CreateFeedProps) {
  const modalCreateFeedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalCreateFeedRef.current &&
        !modalCreateFeedRef.current.contains(event.target as Node)
      ) {
        setShowModalCreateFeed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalCreateFeedRef, setShowModalCreateFeed]);

  return (
    <Modal.Root
      modalRef={modalCreateFeedRef}
      show={showModalCreateFeed}
      closeModal={() => {
        setShowModalCreateFeed(false);
        setTagsFeed([]);
      }}
      className="md:w-[620px] max-h-[600px] overflow-y-auto justify-start"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalCreateFeed(false);
          setTagsFeed([]);
        }}
      />
      <Modal.Header title="Save Feed" />
      <ContentCreateFeed
        setShowModalCreateFeed={setShowModalCreateFeed}
        setTagsFeed={setTagsFeed}
        tagsFeed={tagsFeed}
        setNameFeed={setNameFeed}
        nameFeed={nameFeed}
        handleAddFeed={handleAddFeed}
      />
    </Modal.Root>
  );
}
