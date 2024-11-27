'use client';

import { useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import Modal from '@/components/Modal';

interface EditPostProps {
  post: PostView;
}

export default function EditPost({ post }: EditPostProps) {
  const { pubky } = usePubkyClientContext();
  const [showModalEditPost, setShowModalEditPost] = useState(false);
  const [showModalEditArticle, setShowModalEditArticle] = useState(false);

  return (
    <>
      {post?.details?.author === pubky && (
        <>
          {post?.details?.kind === 'long' ? (
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
      {showModalEditPost && (
        <Modal.EditPost
          showModalEditPost={showModalEditPost}
          setShowModalEditPost={setShowModalEditPost}
          post={post}
        />
      )}
      {showModalEditArticle && (
        <Modal.EditArticle
          showModalEditArticle={showModalEditArticle}
          setShowModalEditArticle={setShowModalEditArticle}
          article={post}
        />
      )}
    </>
  );
}
