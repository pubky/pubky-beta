import { Modal } from '@social/ui-shared';
import { FileView } from '@/types/Post';
import ContentFilesCarousel from './_Content';

interface FilesCarouselProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: FileView[];
  currentFileIndex: number;
}

export default function FilesCarousel({
  showModal,
  setShowModal,
  fileContents,
  currentFileIndex,
}: FilesCarouselProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-h-[90vh] overflow-y-auto overflow-x-hidden cursor-default scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentFilesCarousel
        fileContents={fileContents}
        currentFileIndex={currentFileIndex}
      />
    </Modal.Root>
  );
}
