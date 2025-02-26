import { BottomSheet } from '@social/ui-shared';
import ContentTagCreatePost from '../Modal/_TagCreatePost/_Content';

interface TagCreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
  title?: string;
  className?: string;
}

export default function TagCreatePost({
  show,
  setShow,
  arrayTags,
  setArrayTags,
  title,
  className
}: TagCreatePostProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Tag'} className={className}>
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <ContentTagCreatePost arrayTags={arrayTags} setArrayTags={setArrayTags} />
      </div>
    </BottomSheet.Root>
  );
}
