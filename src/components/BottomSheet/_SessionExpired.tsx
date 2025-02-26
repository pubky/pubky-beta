import { BottomSheet } from '@social/ui-shared';
import ContentSessionExpired from '../Modal/_SessionExpired/_Content';

interface SessionExpiredProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function SessionExpired({ show, setShow, title, className }: SessionExpiredProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Session expired'} className={className}>
      <ContentSessionExpired />
    </BottomSheet.Root>
  );
}
