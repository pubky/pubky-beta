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

  const generatedImage = async (key: string) => {
    const generatedImage = await genJdenticon(key);
    objectUrl = URL.createObjectURL(generatedImage);
    avatarCache.addObjectUrl(objectUrl);
    avatarCache.set(key, objectUrl);
    setImageUrl(objectUrl);
  };

  const fetchAvatar = async (key: string) => {
    const cachedUrl = avatarCache.get(key);
    if (cachedUrl) {
      // The user has not avatar, already proved
      if (cachedUrl === "no_avatar") {
        await generatedImage(key)
      } else {
        setImageUrl(cachedUrl);
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
          // We can avoid the calls once it is proved, the user does not have avatar
          avatarCache.set(key, "no_avatar");
        }
      }
    } catch (error) {
      await generatedImage(key);
    }
  };

  useEffect(() => {
    if (uri) {
      if (typeof uri === 'string') {
        if (uri.startsWith('http') || uri.startsWith('data:')) {
          setImageUrl(uri);
        } else if (uri.startsWith('pubky://')) {
          fetchAvatar(id);
        } else if (uri.length === 52) {
          generatedImage(uri);
        }
      } else if (uri instanceof File) {
        objectUrl = URL.createObjectURL(uri);
        avatarCache.addObjectUrl(objectUrl);
        setImageUrl(objectUrl);
      }
    } else if (id) {
      fetchAvatar(id);
    }

    return () => {
      if (objectUrl) {
        avatarCache.removeObjectUrl(objectUrl);
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, uri]);

  if (loading && !imageUrl) return <Skeletons.Simple />;

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
