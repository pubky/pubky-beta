'use client';

import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { ButtonTooltip } from '../Button';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalReportPost: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function ContentMenu({
  post,
  setShowMenu,
  setShowModalDeletePost,
  setShowModalReportPost,
  setShowModalEditPost,
  setShowModalEditArticle,
}: TooltipMenuProps) {
  const { pubky } = usePubkyClientContext();

  return (
    <>
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
    </>
  );
}
