import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { SimplePostTags } from '@/components/SinglePost/Tags';

interface TagSinglePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function TagSinglePost({ show, setShow, post, title, className }: TagSinglePostProps) {
  return (
    <BottomSheetUI.Root show={show} setShow={setShow} title={title ?? 'Tag Post'} className={className}>
      <SimplePostTags.PostBottomSheet show={show} setShow={setShow} post={post} />
    </BottomSheetUI.Root>
  );
}
