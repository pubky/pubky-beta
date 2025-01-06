'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditArticle from '../Modal/_EditArticle/_Content';

interface EditArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  title?: string;
  className?: string;
}

export default function EditArticle({
  show,
  setShow,
  article,
  title,
  className,
}: EditArticleProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentEditArticle setShowModalEditArticle={setShow} article={article} />
    </BottomSheet.Root>
  );
}
