import { BottomSheet } from '@social/ui-shared';
import ContentPrivacyPolicy from '../Modal/_PrivacyPolicy/_Content';

interface BottomSheetPrivacyPolicyProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function PrivacyPolicy({ show, setShow, title, className }: BottomSheetPrivacyPolicyProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Privacy Policy'} className={className}>
      <ContentPrivacyPolicy setShowModal={setShow} />
    </BottomSheet.Root>
  );
}
