import { BottomSheet } from '@social/ui-shared';
import ContentMinimumAge from '../Modal/_MinimumAge/_Content';

interface BottomSheetMinimumAgeProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function MinimumAge({ show, setShow, title, className }: BottomSheetMinimumAgeProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Age minimum: 18'} className={className}>
      <ContentMinimumAge setShowModal={setShow} />
    </BottomSheet.Root>
  );
}
