'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentCreateArticle from '../Modal/_CreateArticle/_Content';

interface CreateArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreateArticle({
  show,
  setShow,
  title,
  className,
}: CreateArticleProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'New Article'}
      className={className}
    >
      <ContentCreateArticle setShowModalArticle={setShow} />
    </BottomSheet.Root>
  );
}
