import { BottomSheet } from '@social/ui-shared';
import ContentConnectionLost from '../Modal/_ConnectionLost/_Content';

interface ConnectionLostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function ConnectionLost({ show, setShow, title, className }: ConnectionLostProps) {
  return (
    <BottomSheet.Root fixed show={show} setShow={setShow} title={title ?? 'Session expired'} className={className}>
      <ContentConnectionLost />
    </BottomSheet.Root>
  );
}
