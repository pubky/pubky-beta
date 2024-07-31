/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';
import { Icon, Modal } from '@social/ui-shared';
import { IFileContent } from '@/types';

interface FilesCarouselProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: IFileContent[];
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function FilesCarousel({
  showModal,
  setShowModal,
  fileContents,
  currentImageIndex,
  setCurrentImageIndex,
}: FilesCarouselProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? fileContents.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === fileContents.length - 1 ? 0 : prevIndex + 1
    );
  };

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
      className="relative w-[60vw] h-[70vh]"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div
        className="flex items-center justify-center cursor-pointer w-12 h-12 absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-full"
        onClick={showPreviousImage}
      >
        <Icon.ArrowLeft size="16" />
      </div>
      <img
        src={fileContents[currentImageIndex].urls.main}
        alt={`Modal view ${currentImageIndex}`}
        className="w-full h-full object-contain"
      />
      <div
        className="flex items-center justify-center cursor-pointer w-12 h-12 absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-full"
        onClick={showNextImage}
      >
        <Icon.ArrowRight size="16" />
      </div>
    </Modal.Root>
  );
}
