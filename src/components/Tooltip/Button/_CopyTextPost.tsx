import { Icon, Tooltip } from '@social/ui-shared';
import { useToastContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import { PubkyAppPostKind } from 'pubky-app-specs';

interface CopyTextPostProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CopyTextPost({ post, setShowMenu }: CopyTextPostProps) {
  const { addToast } = useToastContext();

  return (
    <>
      {String(post?.details?.kind) !== PubkyAppPostKind[1].toLocaleLowerCase() && (
        <Tooltip.Item
          id="copy-post-text"
          onClick={() => {
            Utils.copyToClipboard(post.details?.content);
            addToast(Utils.truncateText(post.details?.content, 80), 'text');
            setShowMenu(false);
          }}
          icon={<Icon.FileText size="24" />}
        >
          Copy text of post
        </Tooltip.Item>
      )}
    </>
  );
}
