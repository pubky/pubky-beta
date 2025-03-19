import { PostType, PostView } from '@/types/Post';
import { useTagsLogic } from './components/TagsUtils';
import TagsStandard from './components/_TagsStandard';
import InputTag from './components/_InputTag';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
  postType: PostType;
}

export default function Standard({ post, largeView = false, postType }: PostProps) {
  const { tags, isMobile } = useTagsLogic(post, postType);
  return (
    <div className="lg:mt-3 cursor-default" onClick={(event) => event.stopPropagation()}>
      {!(isMobile && tags.length === 0) && (
        <div id="tags" className="gap-2 flex-row inline-flex items-center flex-wrap mt-2 lg:mt-0">
          <TagsStandard post={post} largeView={largeView} postType={postType} />
          {!largeView && (
            <div className="hidden md:flex">
              <InputTag post={post} postType={postType} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
