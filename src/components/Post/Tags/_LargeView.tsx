import { PostType, PostView } from '@/types/Post';
import TagsLargeView from './components/_TagsLargeView';

interface TagsLargeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  postType: PostType;
  articleView?: boolean;
}

export default function LargeView({ post, postType, articleView }: TagsLargeViewProps) {
  return (
    <div className="mt-1.5 w-auto cursor-default" onClick={(event) => event.stopPropagation()}>
      <div className="min-w-[380px] flex-col inline-flex gap-0.5">
        <TagsLargeView post={post} postType={postType} articleView={articleView} />
      </div>
    </div>
  );
}
