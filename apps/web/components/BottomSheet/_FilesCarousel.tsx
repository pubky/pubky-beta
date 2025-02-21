'use client';

import { FileView } from '@/types/Post';
import { BottomSheet } from '@social/ui-shared';
import ContentFilesCarousel from '../Modal/_FilesCarousel/_Content';

interface FilesCarouselProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: FileView[];
  currentFileIndex: number;
  title?: string;
  className?: string;
}

export default function FilesCarousel({
  show,
  setShow,
  fileContents,
  currentFileIndex,
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
      />
    </BottomSheet.Root>
  );
}
