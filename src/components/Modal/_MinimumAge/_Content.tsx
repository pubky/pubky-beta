import { Button, Icon, Typography } from '@social/ui-shared';

interface ContentMinimumAgeProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentMinimumAge({ setShowModal }: ContentMinimumAgeProps) {
  return (
    <>
      <Typography.Body className="text-opacity-80 my-4 mb-6" variant="medium-light">
        You can only use Pubky if you are over 18 years old.
      </Typography.Body>
      <Button.Large onClick={() => setShowModal(false)}>I understand and am over 18 years old</Button.Large>
    </>
  );
}
