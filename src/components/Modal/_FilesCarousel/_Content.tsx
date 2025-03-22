'use client';

import { Icon, Typography } from '@social/ui-shared';
import { FileView } from '@/types/Post';
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface FilesCarouselProps {
  fileContents: FileView[];
  currentFileIndex: number;
}

export default function ContentFilesCarousel({ fileContents, currentFileIndex }: FilesCarouselProps) {
  const isMobile = useIsMobile();
  const [localFileIndex, setLocalFileIndex] = useState(currentFileIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const generateFileUrl = (file: FileView, type = 'main') => `${BASE_URL}/${file.owner_id}/${file.id}/${type}`;
  const mediaFiles = fileContents.filter(
    (file) => file?.content_type.startsWith('image') || file?.content_type.startsWith('video')
  );

  if (mediaFiles.length === 0) return null;

  useEffect(() => {
    setLocalFileIndex(currentFileIndex);
  }, [currentFileIndex]);

  const changeFile = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setLocalFileIndex((prevIndex) => {
      const newIndex =
        direction === 'next'
          ? (prevIndex + 1) % mediaFiles.length
          : (prevIndex - 1 + mediaFiles.length) % mediaFiles.length;
      return newIndex;
    });

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX;

    if (swipeDistance > 50) {
      changeFile('next');
    } else if (swipeDistance < -50) {
      changeFile('prev');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        changeFile('prev');
      } else if (e.key === 'ArrowRight') {
        changeFile('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentFile = mediaFiles[localFileIndex];
  const isVideo = currentFile?.content_type.startsWith('video');

  // Enable zoom
  useEffect(() => {
    const metaTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

    if (!metaTag) return;
    metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';

    return () => {
      metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    };
  }, [localFileIndex]);

  return (
    <div
      className={`${mediaFiles.length > 1 ? 'px-8 md:px-16' : 'px-4 md:px-0'} pb-8 relative flex items-center justify-center`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isMobile && mediaFiles.length > 1 && (
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full"
          onClick={() => changeFile('prev')}
          disabled={isTransitioning}
        >
          <Icon.ArrowLeft size="20" />
        </button>
      )}
      {isVideo ? (
        <video
          src={generateFileUrl(currentFile)}
          controls
          className="rounded-2xl p-6 max-w-full w-auto h-auto max-h-[80vh] object-contain"
        />
      ) : (
        <img
          src={generateFileUrl(currentFile, currentFile.content_type !== 'image/gif' ? 'feed' : 'main')}
          alt={`Modal view ${localFileIndex}`}
          width={800}
          height={418}
          className="rounded-2xl max-w-full w-auto h-auto max-h-[80vh] object-contain transition-opacity duration-300"
        />
      )}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <Typography.Body className="text-opacity-80" variant="small">
          {`${localFileIndex + 1} / ${mediaFiles.length}`}
        </Typography.Body>
      </div>
      {!isMobile && mediaFiles.length > 1 && (
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full"
          onClick={() => changeFile('next')}
          disabled={isTransitioning}
        >
          <Icon.ArrowRight size="20" />
        </button>
      )}
    </div>
  );
}
