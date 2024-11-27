import { Icon, Tooltip } from '@social/ui-shared';

interface ReportProfileProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportProfile({ setShowModal }: ReportProfileProps) {
  return (
    <Tooltip.Item
      id="report-post"
      onClick={() => {
        setShowModal(true);
      }}
      icon={<Icon.Flag size="24" />}
    >
      Report user
    </Tooltip.Item>
  );
}
