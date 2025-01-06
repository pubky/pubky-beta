'use client';

import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import ContentMenu from './_Content';
import Modal from '@/components/Modal';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function Menu({ post, setShowMenu }: TooltipMenuProps) {
  const { deleteFile, deletePost, setTimeline, setNewPosts } =
    usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [showModalReportPost, setShowModalReportPost] = useState(false);
  const [showModalEditPost, setShowModalEditPost] = useState(false);
  const [showModalEditArticle, setShowModalEditArticle] = useState(false);
  const tooltipMenuRef = useRef<HTMLDivElement>(null);
  const modalDeletePostRef = useRef<HTMLDivElement>(null);
  const modalReportPostRef = useRef<HTMLDivElement>(null);
  const modalEditPostRef = useRef<HTMLDivElement>(null);
  const modalEditArticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (modalDeletePostRef.current) {
        if (!modalDeletePostRef.current.contains(event.target as Node)) {
          setShowModalDeletePost(false);
        }
        return;
      }

      if (modalReportPostRef.current) {
        if (!modalReportPostRef.current.contains(event.target as Node)) {
          setShowModalReportPost(false);
        }
        return;
      }
      if (modalEditPostRef.current) {
        if (!modalEditPostRef.current.contains(event.target as Node)) {
          setShowModalEditPost(false);
        }
        return;
      }

      if (modalEditArticleRef.current) {
        if (!modalEditArticleRef.current.contains(event.target as Node)) {
          setShowModalEditArticle(false);
        }
        return;
      }

      if (
        tooltipMenuRef.current &&
        !tooltipMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
    };
  }, [
    tooltipMenuRef,
    setShowMenu,
    modalDeletePostRef,
    setShowModalDeletePost,
    modalReportPostRef,
    setShowModalReportPost,
    modalEditPostRef,
    setShowModalEditPost,
    modalEditArticleRef,
    setShowModalEditArticle,
  ]);

  const handleDeletePost = async () => {
    try {
      // Close the menu optimistically before deleting the post
      setShowMenu(false);
      setTimeline((prevTimeline) =>
        prevTimeline.filter((p) => p.details.id !== post?.details?.id),
      );
      setNewPosts((prevNewPosts) =>
        prevNewPosts.filter((p) => p.details.id !== post?.details?.id),
      );

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
        addAlert('Post deleted successfully');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div ref={tooltipMenuRef}>
        <Tooltip.Main
          id="post-tooltip-menu"
          className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[282px] z-40"
        >
          <ContentMenu
            post={post}
            setShowMenu={setShowMenu}
            setShowModalDeletePost={setShowModalDeletePost}
            setShowModalReportPost={setShowModalReportPost}
            setShowModalEditPost={setShowModalEditPost}
            setShowModalEditArticle={setShowModalEditArticle}
          />
        </Tooltip.Main>
      </div>
      {showModalDeletePost && (
        <Modal.DeletePost
          showModalDeletePost={showModalDeletePost}
          setShowModalDeletePost={setShowModalDeletePost}
          handleDeletePost={handleDeletePost}
          modalDeletePostRef={modalDeletePostRef}
        />
      )}
      {showModalReportPost && (
        <Modal.ReportPost
          showModal={showModalReportPost}
          setShowModal={setShowModalReportPost}
          modalReportPostRef={modalReportPostRef}
          post={post}
        />
      )}
      {showModalEditPost && (
        <Modal.EditPost
          showModalEditPost={showModalEditPost}
          setShowModalEditPost={setShowModalEditPost}
          modalEditPostRef={modalEditPostRef}
          post={post}
        />
      )}
      {showModalEditArticle && (
        <Modal.EditArticle
          showModalEditArticle={showModalEditArticle}
          setShowModalEditArticle={setShowModalEditArticle}
          modalEditArticleRef={modalEditArticleRef}
          article={post}
        />
      )}
    </>
  );
}
