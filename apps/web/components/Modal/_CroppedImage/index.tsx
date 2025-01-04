import { useEffect, useRef } from 'react';
import { Modal } from '@social/ui-shared';
import ContentCroppedImage from './_Content';

interface CroppedImageProps {
  showModalCroppedImage: boolean;
  setShowModalCroppedImage: React.Dispatch<React.SetStateAction<boolean>>;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
}

export default function CroppedImage({
  showModalCroppedImage,
  setShowModalCroppedImage,
  image,
  setImage,
}: CroppedImageProps) {
  const modalCroppedImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalCroppedImage = (event: MouseEvent) => {
      if (
        modalCroppedImageRef.current &&
        !modalCroppedImageRef.current.contains(event.target as Node)
      ) {
        setShowModalCroppedImage(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalCroppedImage);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideModalCroppedImage,
      );
    };
  }, [modalCroppedImageRef, setShowModalCroppedImage]);

  return (
    <Modal.Root
      show={showModalCroppedImage}
      closeModal={() => setShowModalCroppedImage(false)}
      modalRef={modalCroppedImageRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setShowModalCroppedImage(false)} />
      <Modal.Header title="Cropped Image" />
      <ContentCroppedImage
        setShowModalCroppedImage={setShowModalCroppedImage}
        image={image}
        setImage={setImage}
      />
    </Modal.Root>
  );
}
