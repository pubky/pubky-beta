import { Icon, Tooltip } from '@social/ui-shared';
import { useToastContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

interface CopyUserPubkyProps {
  pk: string;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CopyUserPubky({ pk, setShowMenu }: CopyUserPubkyProps) {
  const { addToast } = useToastContext();

  return (
    <Tooltip.Item
      id="copy-user-pubky"
      onClick={() => {
        Utils.copyToClipboard(`pk:${pk}`);
        addToast(`pk:${pk}`, 'pubky');
        setShowMenu(false);
      }}
      icon={<Icon.Key size="24" />}
    >
      Copy user pubky
    </Tooltip.Item>
  );
}
