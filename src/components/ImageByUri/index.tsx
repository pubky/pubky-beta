/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Skeletons from '../Skeletons';
import genJdenticon from '../utils-shared/lib/Helper/genJdenticon';

interface ImageByUriProps {
  id: string;
  alt: string;
  width: number;
  height: number;
  uri?: string | File | undefined;
  className?: string;
  style?: React.CSSProperties;
  onClick?: any;
  loading?: boolean;
}

const ImageByUri = ({ id, uri, alt, width, height, className, style, loading, onClick }: ImageByUriProps) => {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/avatar`;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchImageUrl = async () => {
      try {
        if (uri) {
          if (typeof uri === 'string' && (uri.startsWith('http') || uri.startsWith('data:'))) {
            setImageUrl(uri);
          } else if (uri instanceof File) {
            objectUrl = URL.createObjectURL(uri);
            setImageUrl(objectUrl);
          }
        } else if (id) {
          const urlAvatar = `${BASE_URL}/${id}`;
          const avatarResponse = await fetch(urlAvatar);

          if (avatarResponse.ok) {
            setImageUrl(urlAvatar);
          } else {
            const generatedImage = await genJdenticon(id);
            objectUrl = URL.createObjectURL(generatedImage);
            setImageUrl(objectUrl);
          }
        }
      } catch (error) {
        console.warn('Error Image:', error);
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
