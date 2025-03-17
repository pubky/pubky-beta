import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentMenu from '../Tooltip/_Menu/_Content';

interface PostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  repost?: PostView;
  title?: string;
  className?: string;
}

export default function Post({ show, setShow, post, repost, title, className }: PostProps) {
  return (
    <BottomSheetUI.Root show={show} setShow={setShow} title={title} className={className}>
      <ContentMenu post={post} repost={repost} setShowMenu={setShow} />
    </BottomSheetUI.Root>
  );
}
