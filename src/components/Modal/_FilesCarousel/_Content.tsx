'use client';

import { Icon, Typography } from '@social/ui-shared';
import { FileView } from '@/types/Post';
import { useEffect, useState } from 'react';

interface FilesCarouselProps {
  fileContents: FileView[];
  currentFileIndex: number;
}

export default function ContentFilesCarousel({
  fileContents,
  currentFileIndex,
}: FilesCarouselProps) {
  const [localFileIndex, setLocalFileIndex] = useState(currentFileIndex);
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const mediaFiles = fileContents.filter(
    (file) =>
      file?.content_type.startsWith('image') ||
      file?.content_type.startsWith('video'),
  );

  if (mediaFiles.length === 0) return null;

  useEffect(() => {
    setLocalFileIndex(currentFileIndex);
  }, [currentFileIndex]);

  const showPreviousFile = () => {
    setLocalFileIndex((prevIndex) =>
      prevIndex === 0 ? mediaFiles.length - 1 : prevIndex - 1,
    );
  };

  const showNextFile = () => {
    setLocalFileIndex((prevIndex) =>
      prevIndex === mediaFiles.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const currentFile = mediaFiles[localFileIndex];
  const isVideo = currentFile?.content_type.startsWith('video');

  return (
    <div className="relative sm:w-[50vw] sm:h-[65vh] flex items-center justify-center">
      {mediaFiles.length > 1 && (
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
          alt={`Modal view ${localFileIndex}`}
          width={800}
          height={418}
          className="p-6 max-w-full w-auto h-auto max-h-full object-contain"
        />
      )}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
        <Typography.Body className="text-opacity-80" variant="small">{`${
          localFileIndex + 1
        } / ${mediaFiles.length}`}</Typography.Body>
      </div>
      {mediaFiles.length > 1 && (
        <div
          className="flex items-center justify-center cursor-pointer w-12 h-12 absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-full"
          onClick={showNextFile}
        >
          <Icon.ArrowRight size="16" />
        </div>
      )}
    </div>
  );
}
