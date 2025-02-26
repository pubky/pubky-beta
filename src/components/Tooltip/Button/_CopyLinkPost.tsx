import { Icon, Tooltip } from '@social/ui-shared';
import { useToastContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';

interface CopyLinkPostProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CopyLinkPost({ post, setShowMenu }: CopyLinkPostProps) {
  const { addToast } = useToastContext();

  return (
    <Tooltip.Item
      id="copy-post-link"
      onClick={() => {
        Utils.copyToClipboard(`${window.location.origin}/post/${post?.details?.author}/${post?.details?.id}`);
        addToast(
          Utils.minifyText(`${window.location.origin}/post/${post?.details?.author}/${post?.details?.id}`, 80),
          'link'
        );
        setShowMenu(false);
      }}
      icon={<Icon.Link size="24" />}
    >
      Copy link to post
    </Tooltip.Item>
  );
}
