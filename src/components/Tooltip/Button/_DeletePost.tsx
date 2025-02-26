'use client';

import { Icon, Tooltip } from '@social/ui-shared';
import { useModal, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';

interface DeletePostProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePost({ post, setShowMenu }: DeletePostProps) {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();

  return (
    <>
      {post?.details.author === pubky && (
        <Tooltip.Item
          id="delete-post"
          onClick={() => openModal('deletePost', { setShowMenu: setShowMenu, post: post })}
          icon={<Icon.Trash size="24" color={'#EF4444'} />}
          cssText="text-red-500"
        >
          Delete post
        </Tooltip.Item>
      )}
    </>
  );
}
