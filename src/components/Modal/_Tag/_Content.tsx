import { Input } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { useUtilsTag } from './components/_Utils';
import InputTag from './components/_InputTag';
import Tags from './components/_Tags';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  tagsError?: boolean;
}

export default function ContentTag({ post, tagsError }: TagProps) {
  const { selectedTag } = useUtilsTag(post);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <InputTag post={post} tagsError={tagsError} />
      <div
        id="current-tags"
        className="justify-start items-start gap-2 flex flex-col overflow-y-auto min-w-[200px] max-h-[300px] scrollbar-thin scrollbar-webkit"
      >
        <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
        <Tags post={post} />
      </div>
    </div>
  );
}
