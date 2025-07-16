'use client';

import { Icon, Typography } from '@social/ui-shared';
import { FileView } from '@/types/Post';
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface FilesCarouselProps {
  fileContents: FileView[];
  currentFileIndex: number;
  onClose?: () => void;
}

export default function ContentFilesCarousel({ fileContents, currentFileIndex, onClose }: FilesCarouselProps) {
  const isMobile = useIsMobile();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const generateFileUrl = (file: FileView, type = 'main') => {
    if (file.src === 'external') {
      // For external images, return the URL directly
      return file.uri;
    }
    return `${BASE_URL}/${file.owner_id}/${file.id}/${type}`;
  };
  const mediaFiles = fileContents.filter(
    (file) => file?.content_type.startsWith('image') || file?.content_type.startsWith('video')
  );

  if (mediaFiles.length === 0) return null;

  // Map the currentFileIndex to the correct index in mediaFiles
  const getMediaFileIndex = (fileIndex: number): number => {
    const targetFile = fileContents[fileIndex];
    const mediaIndex = mediaFiles.findIndex((file) => file.id === targetFile.id);
    return mediaIndex >= 0 ? mediaIndex : 0; // Fallback to 0 if not found
  };

  const initialMediaIndex = getMediaFileIndex(currentFileIndex);
  const [localFileIndex, setLocalFileIndex] = useState(initialMediaIndex);

  useEffect(() => {
    const newMediaIndex = getMediaFileIndex(currentFileIndex);
    setLocalFileIndex(newMediaIndex);
    setIsImageLoaded(false);
    setZoomLevel(1); // Reset zoom when changing files
    setPanPosition({ x: 0, y: 0 }); // Reset pan when changing files
  }, [currentFileIndex, fileContents]);

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

    // Reset zoom and pan when changing files
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > 1) {
      // If zoomed in, handle panning
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y
      });
      // Prevent page scroll while panning
      e.preventDefault();
      e.stopPropagation();
    } else {
      // If not zoomed, handle navigation
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      // Limit panning to prevent image from going too far out of view
      const maxPanX = (zoomLevel - 1) * 400;
      const maxPanY = (zoomLevel - 1) * 300;

      setPanPosition({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY))
      });
      // Prevent page scroll while panning
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (zoomLevel <= 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchStartX.current - touchEndX;

      if (swipeDistance > 50) {
        changeFile('next');
      } else if (swipeDistance < -50) {
        changeFile('prev');
      }
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Limit panning to prevent image from going too far out of view
      const maxPanX = (zoomLevel - 1) * 500;
      const maxPanY = (zoomLevel - 1) * 400;

      setPanPosition({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY))
      });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  // Disable zoom
  useEffect(() => {
    const metaTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

    if (!metaTag) return;
    metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

    return () => {
      metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    };
  }, [localFileIndex]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 5));
    // No need to reset pan position when zooming in
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
    setPanPosition({ x: 0, y: 0 }); // Reset pan when zooming
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 }); // Reset pan when resetting zoom
  };

  const handleContainerCloseClick = (e: React.MouseEvent) => {
    const isClickingOnImage = e.target instanceof HTMLImageElement;
    const isClickingOnButton = e.target instanceof HTMLButtonElement || (e.target as Element).closest('button');
    const isClickingOnVideo = e.target instanceof HTMLVideoElement;

    if (isClickingOnImage || isClickingOnButton || isClickingOnVideo) {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`${mediaFiles.length > 1 && !isMobile ? 'px-8 md:px-16' : 'px-4 md:px-0'} pb-8 relative flex flex-col items-center justify-center`}
      style={{
        width: '95dvw',
        height: '95dvh',
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerCloseClick}
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
          className="rounded-2xl p-6 max-w-full w-full md:w-auto md:min-w-[500px] h-auto max-h-[80vh] object-contain"
        />
      ) : (
        <div className="relative overflow-hidden rounded-2xl w-full h-full flex items-center justify-center">
          <img
            src={generateFileUrl(
              currentFile,
              currentFile.content_type === 'image/gif' ? 'main' : isImageLoaded ? 'main' : 'feed'
            )}
            alt={`Modal view ${localFileIndex}`}
            width={800}
            height={418}
            className={`max-w-full rounded-2xl max-h-full w-auto h-auto object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-80'} ${isDragging ? 'cursor-grabbing' : zoomLevel > 1 ? 'cursor-grab' : 'cursor-default'}`}
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              touchAction: 'none'
            }}
            onLoad={() => setIsImageLoaded(true)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      )}
      {!isVideo && (
        <div className="flex gap-1 mt-4">
          <button
            onClick={handleZoomOut}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1.5 rounded-full backdrop-blur-sm"
            disabled={zoomLevel <= 0.5}
          >
            <Icon.Minus size="14" />
          </button>
          <button
            onClick={handleResetZoom}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white px-2 py-1.5 rounded-full text-xs backdrop-blur-sm"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1.5 rounded-full backdrop-blur-sm"
            disabled={zoomLevel >= 5}
          >
            <Icon.Plus size="14" />
          </button>
        </div>
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
