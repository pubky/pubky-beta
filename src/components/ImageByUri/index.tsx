/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { getFile } from '@/services/fileService';
import Skeletons from '../Skeletons';

interface ImageByUriProps {
  id?: string;
  uri: string | File | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  loading?: boolean;
}

const ImageByUri = ({
  id,
  uri,
  alt,
  width,
  height,
  className,
  style,
  loading,
  onClick,
}: ImageByUriProps) => {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const extractKeysFromUri = (uri: string): [string, string] | null => {
      const match = uri.match(/pubky:\/\/(.*?)\/pub\/pubky\.app\/files\/(.*)/);
      return match ? [match[1], match[2]] : null;
    };

    const fetchImageUrl = async () => {
      try {
        if (uri instanceof File) {
          // Handle the case where uri is a File object
          objectUrl = URL.createObjectURL(uri);
          setImageUrl(objectUrl);
        } else if (
          typeof uri === 'string' &&
          (uri.startsWith('http') ||
            uri.startsWith('data:') ||
            uri === '/images/webp/Userpic.webp')
        ) {
          setImageUrl(uri);
        } else if (typeof uri === 'string') {
          const extractedKeys = extractKeysFromUri(uri);
          if (extractedKeys) {
            setImageUrl(`${BASE_URL}/${extractedKeys[0]}/${extractedKeys[1]}`);
          } else {
            const fetchedFile = await getFile(uri);
            if (fetchedFile?.urls) {
              setImageUrl(`${BASE_URL}/${JSON.parse(fetchedFile?.urls).main}`);
            }
          }
        }
      } catch (error) {
        //console.error('Error fetching image:', error);
        setImageUrl('/images/webp/Userpic.webp');
      }
    };

    fetchImageUrl();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [uri]);

  return (
    <>
      {!imageUrl && loading ? (
        <Skeletons.Simple />
      ) : (
        <img
          id={id}
          src={imageUrl || '/images/webp/Userpic.webp'}
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

export { ImageByUri };
