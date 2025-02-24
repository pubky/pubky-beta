import { Icon, Tooltip } from '@social/ui-shared';
import { useModal, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface EditPostProps {
  post: PostView;
}

export default function EditPost({ post }: EditPostProps) {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();

  return (
    <>
      {post?.details?.author === pubky && (
        <>
          {String(post?.details?.kind) ===
          PubkyAppPostKind[1].toLocaleLowerCase() ? (
            <Tooltip.Item
              id="edit-article"
              onClick={() => openModal('editArticle', { article: post })}
              icon={<Icon.Pencil size="24" />}
            >
              Edit article
            </Tooltip.Item>
          ) : (
            <Tooltip.Item
              id="edit-post"
              onClick={() => openModal('editPost', { post })}
              icon={<Icon.Pencil size="24" />}
            >
              Edit post
            </Tooltip.Item>
          )}
        </>
      )}
    </>
  );
}
