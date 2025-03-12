/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Skeletons from '../Skeletons';
import genJdenticon from '../utils-shared/lib/Helper/genJdenticon';

interface ImageByUriProps {
  id?: string;
  uri: string | File | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: any;
  loading?: boolean;
}

const ImageByUri = ({ id, uri, alt, width, height, className, style, loading, onClick }: ImageByUriProps) => {
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
        if (uri && uri !== '/images/webp/Userpic.webp') {
          if (uri instanceof File) {
            // Handle the case where uri is a File object
            objectUrl = URL.createObjectURL(uri);
            setImageUrl(objectUrl);
          } else if (typeof uri === 'string' && (uri.startsWith('http') || uri.startsWith('data:'))) {
            setImageUrl(uri);
          } else if (typeof uri === 'string') {
            const extractedKeys = extractKeysFromUri(uri);
            if (extractedKeys) {
              setImageUrl(`${BASE_URL}/${extractedKeys[0]}/${extractedKeys[1]}`);
            }
          }
        } else {
          const generatedImage = await genJdenticon(id);
          objectUrl = URL.createObjectURL(generatedImage);
          setImageUrl(objectUrl);
        }
      } catch (error) {
        console.warn('Error fetching image:', error);
      }
    };

    fetchImageUrl();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, uri]);

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
