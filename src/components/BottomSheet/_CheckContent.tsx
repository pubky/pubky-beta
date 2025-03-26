import { BottomSheet } from '@social/ui-shared';
import ContentCheck from '../Modal/_CheckContent/_Content';

interface CheckContentProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShow2: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CheckContent({ show, setShow, setShow2, title, className }: CheckContentProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Do you want to close it?'} className={className}>
      <ContentCheck setShow={setShow} setShow2={setShow2} />
    </BottomSheet.Root>
  );
}
