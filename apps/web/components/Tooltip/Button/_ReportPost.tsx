import { Icon, Tooltip } from '@social/ui-shared';

interface ReportPostProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportPost({ setShowModal }: ReportPostProps) {
  return (
    <Tooltip.Item
      id="report-post"
      onClick={() => {
        setShowModal(true);
      }}
      icon={<Icon.Flag size="24" />}
    >
      Report post
    </Tooltip.Item>
  );
}
