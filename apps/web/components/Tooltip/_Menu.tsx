'use client';

import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { ButtonTooltip } from './Button';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import Modal from '../Modal';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function Menu({ post, repost, setShowMenu }: TooltipMenuProps) {
  const { pubky, deleteFile, deletePost } = usePubkyClientContext();
  const { setContent, setShow } = useAlertContext();
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [showModalReportPost, setShowModalReportPost] = useState(false);
  const [showModalEditPost, setShowModalEditPost] = useState(false);
  const [showModalEditArticle, setShowModalEditArticle] = useState(false);
  const tooltipMenuRef = useRef<HTMLDivElement>(null);
  const modalDeletePostRef = useRef<HTMLDivElement>(null);
  const modalReportPostRef = useRef<HTMLDivElement>(null);

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
  ]);

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
        setContent('Post deleted successfully');
      } else {
        setContent('Something wrong. Try again', 'warning');
      }
      setShow(true);
    } catch (error) {
      console.log(error);
    } finally {
      setShowMenu(false);
    }
  };

  return (
    <>
      <div ref={tooltipMenuRef}>
        <Tooltip.Main
          id="post-tooltip-menu"
          className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[282px] z-40"
        >
          {post?.details?.author !== pubky && (
            <ButtonTooltip.Follow
              pk={post?.details?.author}
              setShowMenu={setShowMenu}
            />
          )}
          {/**post?.details?.author === pubky && (
            <ButtonTooltip.EditProfile setShowMenu={setShowMenu}/>
          )*/}
          <ButtonTooltip.EditPost
            post={post}
            setShowModalEditArticle={setShowModalEditArticle}
            setShowModalEditPost={setShowModalEditPost}
          />
          <ButtonTooltip.CopyUserPubky
            pk={post?.details?.author}
            setShowMenu={setShowMenu}
          />
          <ButtonTooltip.CopyLinkPost post={post} setShowMenu={setShowMenu} />
          <ButtonTooltip.CopyTextPost post={post} setShowMenu={setShowMenu} />
          {/**<ButtonTooltip.Bookmark post={post} repost={repost} setShowMenu={setShowMenu} />*/}
          {post?.details?.author !== pubky && (
            <ButtonTooltip.Mute pk={post?.details?.author} />
          )}
          <ButtonTooltip.DeletePost
            post={post}
            setShowModalDeletePost={setShowModalDeletePost}
          />
          {post?.details?.author !== pubky && (
            <ButtonTooltip.ReportPost setShowModal={setShowModalReportPost} />
          )}
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
