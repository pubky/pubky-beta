import { useEffect, useRef, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Icon, Modal } from '@social/ui-shared';

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedImageProps {
  setShowModalCroppedImage: React.Dispatch<React.SetStateAction<boolean>>;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
}

export default function ContentCroppedImage({ setShowModalCroppedImage, image, setImage }: CroppedImageProps) {
  const modalCroppedImageRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>();

  useEffect(() => {
    const handleClickOutsideModalCroppedImage = (event: MouseEvent) => {
      if (modalCroppedImageRef.current && !modalCroppedImageRef.current.contains(event.target as Node)) {
        setShowModalCroppedImage(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalCroppedImage);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalCroppedImage);
    };
  }, [modalCroppedImageRef, setShowModalCroppedImage]);

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
          croppedAreaPixels.height
        );

        return new Promise<File>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
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
      setShowModalCroppedImage(false);
    }
  };

  return (
    <>
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
        <Button.Large variant="secondary" onClick={() => setShowModalCroppedImage(false)}>
          Cancel
        </Button.Large>
        <Modal.SubmitAction onClick={handleDone} icon={<Icon.ArrowRight size="16" />}>
          Done
        </Modal.SubmitAction>
      </div>
    </>
  );
}
