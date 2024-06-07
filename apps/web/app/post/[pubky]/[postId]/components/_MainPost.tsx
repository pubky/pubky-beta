import { Post } from '../../../../../components';
import { IPost } from '../../../../../types';
import Skeletons from '../../../../../components/Skeletons';

export default function MainPost({
  post,
  loading,
  uri,
}: {
  post: IPost;
  loading: boolean;
  uri: string;
}) {
  return (
    <>
      {loading ? (
        <Skeletons.Simple />
      ) : (
        <Post key={uri} post={post} size="full" fullContent />
      )}
    </>
  );
}
