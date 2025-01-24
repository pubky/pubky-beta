import { BottomSheet } from '@social/ui-shared';
import ContentDraft from '../Modal/_Draft/_Content';

interface DraftProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function Draft({
  show,
  setShow,
  setClose,
  title,
  className,
}: DraftProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Do you want to close?'}
      className={className}
    >
      <ContentDraft setShow={setShow} setClose={setClose} />
    </BottomSheet.Root>
  );
}
