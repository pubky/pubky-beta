import { Icon, Tooltip } from '@social/ui-shared';
import { useToastContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';

interface CopyTextPostProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CopyTextPost({ post, setShowMenu }: CopyTextPostProps) {
  const { addToast } = useToastContext();

  return (
    <>
      {post?.details?.kind !== 'long' && (
        <Tooltip.Item
          id="copy-post-text"
          onClick={() => {
            Utils.copyToClipboard(post.details?.content);
            addToast(Utils.minifyContent(post.details?.content, 1), 'text');
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
