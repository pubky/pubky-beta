/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';
import { Modal } from '@social/ui-shared';
import { FileView } from '@/types/Post';
import ContentFilesCarousel from './_Content';

interface FilesCarouselProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: FileView[];
  currentFileIndex: number;
  setCurrentFileIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function FilesCarousel({
  showModal,
  setShowModal,
  fileContents,
  currentFileIndex,
  setCurrentFileIndex,
}: FilesCarouselProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal]);

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="max-h-[90vh] overflow-y-auto overflow-x-hidden cursor-default scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentFilesCarousel
        fileContents={fileContents}
        currentFileIndex={currentFileIndex}
        setCurrentFileIndex={setCurrentFileIndex}
      />
    </Modal.Root>
  );
}
