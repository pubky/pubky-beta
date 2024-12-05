import { Icon, Tooltip } from '@social/ui-shared';
import { useToastContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

interface CopyLinkProfileProps {
  creatorPubky: string;
}

export default function CopyLinkProfile({
  creatorPubky,
}: CopyLinkProfileProps) {
  const { setContent: setContentToast, setShow: setShowToast } =
    useToastContext();

  return (
    <Tooltip.Item
      onClick={() => {
        setContentToast(
          `${window.location.origin}/profile/${creatorPubky}`,
          'link',
        );
        setShowToast(true);
        Utils.copyToClipboard(creatorPubky);
      }}
      icon={<Icon.Link size="20" />}
    >
      Copy profile link
    </Tooltip.Item>
  );
}
