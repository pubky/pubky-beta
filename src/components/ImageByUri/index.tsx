/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Skeletons from '../Skeletons';
import genJdenticon from '../utils-shared/lib/Helper/genJdenticon';
import { avatarCache } from '../utils-shared/lib/Helper/avatarCache';
import { Utils } from '@social/utils-shared';
import { Icon } from '../ui-shared';

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
  isCensored?: boolean;
}

const UNBLURRED_IMAGES_KEY = 'unblurred_images';

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
  isCensored
}: ImageByUriProps) => {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/avatar`;
  let objectUrl: string | null = null;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUnblurred, setIsUnblurred] = useState(false);
  const blurCensored = Utils.storage.get('blurCensored') as boolean;
  const censored = !isUnblurred && isCensored && (blurCensored === false ? false : true);

  useEffect(() => {
    if (id && isCensored) {
      const unblurredImages = (Utils.storage.get(UNBLURRED_IMAGES_KEY) as string[]) || [];
      setIsUnblurred(unblurredImages.includes(id));
    }
  }, [id, isCensored]);

  const handleUnblur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (id) {
      const unblurredImages = (Utils.storage.get(UNBLURRED_IMAGES_KEY) as string[]) || [];
      if (!unblurredImages.includes(id)) {
        Utils.storage.set(UNBLURRED_IMAGES_KEY, [...unblurredImages, id]);
      }
    }
    setIsUnblurred(true);
  };

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
      if (cachedUrl === 'no_avatar') {
        await generatedImage(key);
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
          avatarCache.set(key, 'no_avatar');
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
    <div className="relative">
      <img
        id={id}
        src={imageUrl || '/images/webp/Userpic.webp'}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${censored ? 'blur-2xl' : ''}`}
        style={style}
        onClick={onClick}
      />
      {censored && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 z-10"
          onClick={handleUnblur}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Icon.EyeSlash size={width === 136 ? '32' : '16'} />
          </div>
        </div>
      )}
    </div>
  );
};

export { ImageByUri };
