import Skeletons from '@/components/Skeletons';
import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { Post } from '@/components';

interface RenderPostsProps {
  posts: PostView[] | undefined;
  initloadingPosts: boolean;
}

const RenderPosts = ({ posts, initloadingPosts }: RenderPostsProps) => {
  if (initloadingPosts) {
    return <Skeletons.Simple />;
  }

  return (
    <div className="flex flex-col gap-3" id="hot-posts">
      <Typography.H2 className="text-opacity-50 font-light">
        Hot Posts
      </Typography.H2>
      {posts?.map((post) => (
        <div key={post.details.id} className="flex flex-col">
          <Post key={`post-${post.details.id}`} post={post} />
        </div>
      ))}
    </div>
  );
};

export default RenderPosts;
