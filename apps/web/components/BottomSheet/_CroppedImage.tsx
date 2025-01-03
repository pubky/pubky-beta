'use client';

import { BottomSheet, Button, Icon } from '@social/ui-shared';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedImageProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  title?: string;
  className?: string;
}

export default function CroppedImage({
  show,
  setShow,
  image,
  setImage,
  title,
  className,
}: CroppedImageProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    if (croppedArea) setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = String(image);

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    if (croppedAreaPixels) {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );

        return new Promise<File>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(
                new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }),
              );
            }
          }, 'image/jpeg');
        });
      }
    }
  }, [croppedAreaPixels, image]);

  const handleDone = async () => {
    if (croppedAreaPixels) {
      const croppedImageFile = await getCroppedImg();
      if (croppedImageFile) {
        setImage(croppedImageFile);
      }
      setShow(false);
    }
  };
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Cropped Image'}
      className={className}
    >
      <div className="relative h-[400px] bg-white bg-opacity-20 border-2 border-white border-opacity-20 rounded-2xl mt-4">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex gap-4 my-6">
        <Button.Large variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button.Large>
        <Button.Large onClick={handleDone} icon={<Icon.ArrowRight size="16" />}>
          Done
        </Button.Large>
      </div>
    </BottomSheet.Root>
  );
}
