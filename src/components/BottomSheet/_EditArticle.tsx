'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditArticle from '../Modal/_EditArticle/_Content';

interface EditArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function EditArticle({ show, setShow, article, setShowMenu, title, className }: EditArticleProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
      <ContentEditArticle
        className="p-0 border-none"
        setShowModalEditArticle={setShow}
        article={article}
        setShowMenu={setShowMenu}
      />
    </BottomSheet.Root>
  );
}
