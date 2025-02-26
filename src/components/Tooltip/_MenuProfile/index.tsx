import { Tooltip } from '@social/ui-shared';
import { UserView } from '@/types/User';
import ContentProfileMenu from './_Content';

interface TooltipProfileMenuProps {
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
  profile: UserView | null;
}

export default function ProfileMenu({ setShowProfileMenu, creatorPubky, profile }: TooltipProfileMenuProps) {
  return (
    <>
      <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0" />
      <Tooltip.Main
        onClick={(e) => e.stopPropagation()}
        className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[282px]"
      >
        <ContentProfileMenu
          setShowProfileMenu={setShowProfileMenu}
          creatorPubky={creatorPubky}
          name={profile?.details?.name ?? ''}
        />
      </Tooltip.Main>
    </>
  );
}
