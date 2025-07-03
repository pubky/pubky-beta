import { Modal } from '@social/ui-shared';
import { FileView } from '@/types/Post';
import ContentFilesCarousel from './_Content';

interface FilesCarouselProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fileContents: FileView[];
  currentFileIndex: number;
}

export default function FilesCarousel({ showModal, setShowModal, fileContents, currentFileIndex }: FilesCarouselProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="bg-transparent shadow-none p-0 border-none max-h-full overflow-y-auto overflow-x-hidden cursor-default scrollbar-thin scrollbar-webkit"
    >
      <ContentFilesCarousel
        fileContents={fileContents}
        currentFileIndex={currentFileIndex}
        onClose={() => setShowModal(false)}
      />
    </Modal.Root>
  );
}
