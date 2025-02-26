import { Modal } from '@social/ui-shared';
import ContentCroppedImage from './_Content';

interface CroppedImageProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  image: string | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | string | undefined>>;
}

export default function CroppedImage({ showModal, setShowModal, image, setImage }: CroppedImageProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Cropped Image" />
      <ContentCroppedImage setShowModalCroppedImage={setShowModal} image={image} setImage={setImage} />
    </Modal.Root>
  );
}
