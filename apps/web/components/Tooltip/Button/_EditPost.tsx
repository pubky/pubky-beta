import { Icon, Tooltip } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface EditPostProps {
  post: PostView;
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditPost({
  post,
  setShowModalEditArticle,
  setShowModalEditPost,
}: EditPostProps) {
  const { pubky } = usePubkyClientContext();

  return (
    <>
      {post?.details?.author === pubky && (
        <>
          {String(post?.details?.kind) ===
          PubkyAppPostKind[1].toLocaleLowerCase() ? (
            <Tooltip.Item
              id="edit-article"
              onClick={() => setShowModalEditArticle(true)}
              icon={<Icon.Pencil size="24" />}
            >
              Edit article
            </Tooltip.Item>
          ) : (
            <Tooltip.Item
              id="edit-post"
              onClick={() => setShowModalEditPost(true)}
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
