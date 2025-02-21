import { Modal } from '@social/ui-shared';
import { PostTag, PostView } from '@/types/Post';
import ContentTag from './_Content';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  tags: PostTag[];
  post: PostView;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  selectedTag?: PostTag | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
}

export default function Tag({
  showModalTag,
  setShowModalTag,
  tags,
  post,
  handleAddTag,
  handleDeleteTag,
  selectedTag,
  setSelectedTag,
}: TagProps) {
  return (
    <Modal.Root
      show={showModalTag}
      closeModal={() => 
        setShowModalTag(false)}
      className="w-full md:max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        id="close-btn"
        onClick={() => 
          setShowModalTag(false)}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title="Tag Post" />
        <Modal.Content className="flex flex-row w-full">
          <ContentTag
              tags={tags}
              post={post}
              handleAddTag={handleAddTag}
              handleDeleteTag={handleDeleteTag}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
          />
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
