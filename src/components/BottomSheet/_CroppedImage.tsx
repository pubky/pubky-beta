'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentCroppedImage from '../Modal/_CroppedImage/_Content';

interface CroppedImageProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  title?: string;
  className?: string;
}

export default function CroppedImage({ show, setShow, image, setImage, title, className }: CroppedImageProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Cropped Image'} className={className}>
      <ContentCroppedImage setShowModalCroppedImage={setShow} image={image} setImage={setImage} />
    </BottomSheet.Root>
  );
}
