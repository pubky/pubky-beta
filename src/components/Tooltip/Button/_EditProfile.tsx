import { Icon, Tooltip } from '@social/ui-shared';
import { useRouter } from 'next/navigation';

interface EditProfileProps {
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProfile({ setShowMenu }: EditProfileProps) {
  const router = useRouter();

  return (
    <Tooltip.Item
      id="edit-profile"
      onClick={() => {
        router.push('/settings/edit');
        setShowMenu(false);
      }}
      icon={<Icon.Pencil size="24" />}
    >
      Edit profile
    </Tooltip.Item>
  );
}
