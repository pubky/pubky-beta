'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useClientContext } from '@/contexts';

interface ImageByUriProps {
  id?: string;
  uri: string | File | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const ImageByUri = ({
  id,
  uri,
  alt,
  width,
  height,
  className,
  style,
  onClick,
}: ImageByUriProps) => {
  const { getFile } = useClientContext();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

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
            uri === '/images/Userpic.png')
        ) {
          setImageUrl(uri);
        } else if (typeof uri === 'string') {
          const fetchedFile = await getFile(uri);
          if (fetchedFile?.urls.main) {
            setImageUrl(fetchedFile.urls.main);
          }
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl('/images/Userpic.png');
      }
    };

    fetchImageUrl();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [uri, getFile]);

  return (
    <Image
      id={id}
      src={imageUrl || '/images/Userpic.png'}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
};

export { ImageByUri };
