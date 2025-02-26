import { useModal } from '@/contexts';
import { Icon, Tooltip } from '@social/ui-shared';

interface ReportProfileProps {
  creatorPubky: string;
  name: string;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportProfile({ creatorPubky, name, setShowMenu }: ReportProfileProps) {
  const { openModal } = useModal();

  return (
    <Tooltip.Item
      id="report-post"
      onClick={() =>
        openModal('reportProfile', {
          pk: creatorPubky,
          name: name,
          setShowMenu: setShowMenu
        })
      }
      icon={<Icon.Flag size="24" />}
    >
      Report user
    </Tooltip.Item>
  );
}
