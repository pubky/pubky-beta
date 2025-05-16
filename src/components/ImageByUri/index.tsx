/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Skeletons from '../Skeletons';
import genJdenticon from '../utils-shared/lib/Helper/genJdenticon';
import { avatarCache } from '../utils-shared/lib/Helper/avatarCache';

interface ImageByUriProps {
  id: string;
  alt: string;
  width: number;
  height: number;
  uri?: string | File;
  className?: string;
  style?: React.CSSProperties;
  onClick?: any;
  loading?: boolean;
}

const ImageByUri = ({ id, uri, alt, width, height, className, style, loading, onClick }: ImageByUriProps) => {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/avatar`;
  let objectUrl: string | null = null;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const generatedImage = async (key: string) => {
    try {
      const generatedImage = await genJdenticon(key);
      objectUrl = URL.createObjectURL(generatedImage);
      avatarCache.addObjectUrl(objectUrl);
      avatarCache.set(key, objectUrl);
      setImageUrl(objectUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setImageUrl('/images/webp/Userpic.webp');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvatar = async (key: string) => {
    if (!key) {
      setImageUrl('/images/webp/Userpic.webp');
      setIsLoading(false);
      return;
    }

    const cachedUrl = avatarCache.get(key);
    if (cachedUrl) {
      if (cachedUrl === 'no_avatar') {
        await generatedImage(key);
      } else {
        setImageUrl(cachedUrl);
        setIsLoading(false);
      }
      return;
    }

    try {
      const urlAvatar = `${BASE_URL}/${key}`;
      const response = await fetch(urlAvatar);
      if (response.ok) {
        avatarCache.set(key, urlAvatar);
        setImageUrl(urlAvatar);
      } else {
        await generatedImage(key);
        if (response.status === 404) {
          avatarCache.set(key, 'no_avatar');
        }
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
      await generatedImage(key);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!isMounted) return;

      if (uri) {
        if (typeof uri === 'string') {
          if (uri.startsWith('http') || uri.startsWith('data:')) {
            setImageUrl(uri);
            setIsLoading(false);
          } else if (uri.startsWith('pubky://')) {
            await fetchAvatar(id);
          } else if (uri.length === 52) {
            await generatedImage(uri);
          }
        } else if (uri instanceof File) {
          objectUrl = URL.createObjectURL(uri);
          avatarCache.addObjectUrl(objectUrl);
          setImageUrl(objectUrl);
          setIsLoading(false);
        }
      } else if (id) {
        await fetchAvatar(id);
      } else {
        setImageUrl('/images/webp/Userpic.webp');
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        avatarCache.removeObjectUrl(objectUrl);
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, uri]);

  if (loading || isLoading) return <Skeletons.Simple />;

  return (
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
  );
};

export { ImageByUri };
