'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { BottomSheet } from '.';
import ContentMenu from '../Tooltip/_Menu/_Content';

interface MenuProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  repost?: PostView;
  title?: string;
  className?: string;
}

export default function Menu({
  show,
  setShow,
  post,
  title,
  className,
}: MenuProps) {
  const { deleteFile, deletePost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [showSheetDeletePost, setShowSheetDeletePost] = useState(false);
  const [showSheetReportPost, setShowSheetReportPost] = useState(false);
  const [showSheetEditPost, setShowSheetEditPost] = useState(false);
  const [showSheetEditArticle, setShowSheetEditArticle] = useState(false);

  const handleDeletePost = async () => {
    try {
      if (post?.details?.attachments) {
        const fileDeletions = Object.values(post?.details?.attachments).map(
          async (file) => {
            await deleteFile(file);
          },
        );
        await Promise.all(fileDeletions);
      }

      const result = await deletePost(post?.details?.id);

      if (result) {
        addAlert('Post deleted');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShow(false);
    }
  };
  return (
    <BottomSheetUI.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentMenu
        post={post}
        setShowMenu={setShow}
        setShowModalDeletePost={setShowSheetDeletePost}
        setShowModalReportPost={setShowSheetReportPost}
        setShowModalEditPost={setShowSheetEditPost}
        setShowModalEditArticle={setShowSheetEditArticle}
      />
      {showSheetDeletePost && (
        <BottomSheet.DeletePost
          show={showSheetDeletePost}
          setShow={setShowSheetDeletePost}
          handleDeletePost={handleDeletePost}
        />
      )}
      {showSheetReportPost && (
        <BottomSheet.ReportPost
          show={showSheetReportPost}
          setShow={setShowSheetReportPost}
          post={post}
        />
      )}
      {showSheetEditPost && (
        <BottomSheet.EditPost
          show={showSheetEditPost}
          setShow={setShowSheetEditPost}
          post={post}
        />
      )}
      {showSheetEditArticle && (
        <BottomSheet.EditArticle
          show={showSheetEditArticle}
          setShow={setShowSheetEditArticle}
          article={post}
        />
      )}
    </BottomSheetUI.Root>
  );
}
