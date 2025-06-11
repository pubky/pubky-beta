/* eslint-disable @next/next/no-img-element */
'use client';

import Skeletons from '@/components/Skeletons';
import { getFile } from '@/services/fileService';
import { FileView } from '@/types/Post';
import { useEffect, useState } from 'react';

interface ImageByUriProps {
  uri: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: any;
}

const ImageArticle = ({ uri, alt, width, height, className, style, onClick }: ImageByUriProps) => {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const generateFileUrl = (file: FileView, type = 'main') => `${BASE_URL}/${file.owner_id}/${file.id}/${type}`;

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const fetchedFile = await getFile(uri);
        setImageUrl(generateFileUrl(fetchedFile, 'main'));
      } catch (error) {
        console.warn('Error Image Article:', error);
      }
    };

    fetchImageUrl();
  }, [uri]);

  return (
    <>
      {!imageUrl ? (
        <Skeletons.Simple />
      ) : (
        <img
          id=""
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
          onClick={onClick}
        />
      )}
    </>
  );
};

export { ImageArticle };
