'use client';

import { Modal as ModalUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { Input } from '@social/ui-shared';
import { TagsInteractionUtils } from './utils/_TagsInteractionUtils';
import { InputTagEditor } from './components/_InputTagEditor';
import { TagsDisplay } from './components/_TagsDisplay';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  tagsError?: boolean;
}

export function PostModal({ showModal, setShowModal, post, tagsError }: TagProps) {
  const { selectedTag } = TagsInteractionUtils(post);

  return (
    <ModalUI.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="w-full md:max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <ModalUI.CloseAction id="close-btn" onClick={() => setShowModal(false)} />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <ModalUI.Header title="Tag Post" />
        <ModalUI.Content className="flex flex-row w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <InputTagEditor post={post} tagsError={tagsError} />
            <div
              id="current-tags"
              className="justify-start items-start gap-2 flex flex-col overflow-y-auto min-w-[200px] max-h-[300px] scrollbar-thin scrollbar-webkit"
            >
              <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
              <TagsDisplay post={post} />
            </div>
          </div>
        </ModalUI.Content>
      </div>
    </ModalUI.Root>
  );
}

export default PostModal;
