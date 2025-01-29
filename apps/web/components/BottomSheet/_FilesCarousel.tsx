'use client';

import { FileView } from '@/types/Post';
import { BottomSheet } from '@social/ui-shared';
import ContentFilesCarousel from '../Modal/_FilesCarousel/_Content';

interface FilesCarouselProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: FileView[];
  currentFileIndex: number;
  setCurrentFileIndex: React.Dispatch<React.SetStateAction<number>>;
  title?: string;
  className?: string;
}

export default function FilesCarousel({
  show,
  setShow,
  fileContents,
  currentFileIndex,
  setCurrentFileIndex,
  title,
  className,
}: FilesCarouselProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentFilesCarousel
        fileContents={fileContents}
        currentFileIndex={currentFileIndex}
        setCurrentFileIndex={setCurrentFileIndex}
      />
    </BottomSheet.Root>
  );
}
