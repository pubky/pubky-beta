'use client';

import { PostView } from '@/types/Post';
import { Input } from '@social/ui-shared';
import { Components } from './components';
import Root from '../../ui-shared/lib/BottomSheet/_Root';
import { TagsInteractionUtils } from './utils/_TagsInteractionUtils';

interface TagProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export function PostBottomSheet({ show, setShow, post, title, className }: TagProps) {
  const { selectedTag } = TagsInteractionUtils(post);

  return (
    <Root show={show} setShow={setShow} title={title ?? 'Tag Post'} className={className}>
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Components.InputTag post={post} />
          <div
            id="current-tags"
            className="justify-start items-start gap-2 flex flex-col overflow-y-auto min-w-[200px] max-h-[300px] scrollbar-thin scrollbar-webkit"
          >
            <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
            <Components.TagsDisplay post={post} />
          </div>
        </div>
      </div>
    </Root>
  );
}

export default PostBottomSheet;
