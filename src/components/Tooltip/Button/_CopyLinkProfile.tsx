import { Icon, Tooltip } from '@social/ui-shared';
import { useToastContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

interface CopyLinkProfileProps {
  creatorPubky: string;
}

export default function CopyLinkProfile({ creatorPubky }: CopyLinkProfileProps) {
  const { addToast } = useToastContext();

  return (
    <Tooltip.Item
      onClick={() => {
        addToast(`${window.location.origin}/profile/${creatorPubky}`, 'link');
        Utils.copyToClipboard(creatorPubky);
      }}
      icon={<Icon.Link size="20" />}
    >
      Copy profile link
    </Tooltip.Item>
  );
}
