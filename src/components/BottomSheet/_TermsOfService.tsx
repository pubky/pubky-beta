import { BottomSheet } from '@social/ui-shared';
import ContentTermsOfService from '../Modal/_TermsOfService/_Content';

interface BottomSheetTermsOfServiceProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function TermsOfService({ show, setShow, title, className }: BottomSheetTermsOfServiceProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Terms of Service'} className={className}>
      <ContentTermsOfService setShowModal={setShow} />
    </BottomSheet.Root>
  );
}
