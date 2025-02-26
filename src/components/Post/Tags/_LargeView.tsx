import { PostView } from '@/types/Post';
import TagsLargeView from './components/_TagsLargeView';
import InputTag from './components/_InputTag';

interface TagsLargeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
}

export default function LargeView({ post }: TagsLargeViewProps) {
  return (
    <div className="mt-1.5 w-auto cursor-default" onClick={(event) => event.stopPropagation()}>
      <div className={`min-w-[380px] flex-col inline-flex gap-2`}>
        <TagsLargeView post={post} />
        <div className="flex">
          <InputTag post={post} />
        </div>
      </div>
    </div>
  );
}
