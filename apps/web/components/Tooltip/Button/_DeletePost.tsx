'use client';

import { Icon, Tooltip } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface DeletePostProps {
  post: PostView;
  setShowModalDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePost({
  post,
  setShowModalDeletePost,
}: DeletePostProps) {
  const { pubky } = usePubkyClientContext();

  return (
    <>
      {post?.details.author === pubky && (
        <Tooltip.Item
          id="delete-post"
          onClick={() => setShowModalDeletePost(true)}
          icon={<Icon.Trash size="24" color={'#EF4444'} />}
          cssText="text-red-500"
        >
          Delete post
        </Tooltip.Item>
      )}
    </>
  );
}
