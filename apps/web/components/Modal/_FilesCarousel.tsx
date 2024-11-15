/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';
import { Icon, Modal, Typography } from '@social/ui-shared';
import { FileContent } from '@/types/Post';

interface FilesCarouselProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: FileContent[];
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
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const modalRef = useRef<HTMLDivElement>(null);

  const showPreviousFile = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex === 0 ? fileContents.length - 1 : prevIndex - 1
    );
  };

  const showNextFile = () => {
    setCurrentFileIndex((prevIndex) =>
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

  const currentFile = fileContents[currentFileIndex];
  const isVideo = currentFile.content_type.startsWith('video');

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="relative w-[60vw] h-[70vh]"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      {fileContents.length > 1 && (
        <div
          className="flex items-center justify-center cursor-pointer w-12 h-12 absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-full"
          onClick={showPreviousFile}
        >
          <Icon.ArrowLeft size="16" />
        </div>
      )}
      {isVideo ? (
        <video
          src={`${BASE_URL}/${JSON.parse(currentFile?.urls).main}`}
          controls
          className="p-6 max-w-full w-auto h-auto max-h-full object-contain"
        />
      ) : (
        <img
          src={`${BASE_URL}/${JSON.parse(currentFile?.urls).main}`}
          alt={`Modal view ${currentFileIndex}`}
          width={800}
          height={418}
          className="p-6 max-w-full w-auto h-auto max-h-full object-contain"
        />
      )}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <Typography.Body className="text-opacity-80" variant="small">{`${
          currentFileIndex + 1
        } / ${fileContents.length}`}</Typography.Body>
      </div>
      {fileContents.length > 1 && (
        <div
          className="flex items-center justify-center cursor-pointer w-12 h-12 absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-full"
          onClick={showNextFile}
        >
          <Icon.ArrowRight size="16" />
        </div>
      )}
    </Modal.Root>
  );
}
