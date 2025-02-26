import { BottomSheet } from '@social/ui-shared';
import ContentCheckLink from '../Modal/_CheckLink/_Content';

interface CheckLinkProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  clickedLink: string;
  title?: string;
  className?: string;
}

export default function CheckLink({ show, setShow, clickedLink, title, className }: CheckLinkProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Double-check this link'} className={className}>
      <ContentCheckLink setShow={setShow} clickedLink={clickedLink} />
    </BottomSheet.Root>
  );
}
