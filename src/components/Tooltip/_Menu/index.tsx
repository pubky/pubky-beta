import { Tooltip } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentMenu from './_Content';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function Menu({ post, setShowMenu }: TooltipMenuProps) {
  return (
    <Tooltip.Main
      id="post-tooltip-menu"
      onClick={(e) => e.stopPropagation()}
      className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[282px] pointer-events-auto"
      onClickOutside={() => setShowMenu(false)}
    >
      <ContentMenu post={post} setShowMenu={setShowMenu} />
    </Tooltip.Main>
  );
}
