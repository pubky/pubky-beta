import { Modal } from '@social/ui-shared';
import ContentTagCreatePost from './_Content';
interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagCreatePost({ showModal, setShowModal, arrayTags, setArrayTags }: TagProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction id="close-btn" onClick={() => setShowModal(false)} />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title="Tag" />
        <Modal.Content className="flex flex-row md:w-[350px]">
          <ContentTagCreatePost arrayTags={arrayTags} setArrayTags={setArrayTags} />
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
