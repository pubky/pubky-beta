import { useModal } from '@/contexts';
import { PostView } from '@/types/Post';
import { Icon, Tooltip } from '@social/ui-shared';

interface ReportPostProps {
  post: PostView;
}

export default function ReportPost({ post }: ReportPostProps) {
  const { openModal } = useModal();

  return (
    <Tooltip.Item
      id="report-post"
      onClick={() => openModal('reportPost', { post })}
      icon={<Icon.Flag size="24" />}
    >
      Report post
    </Tooltip.Item>
  );
}
