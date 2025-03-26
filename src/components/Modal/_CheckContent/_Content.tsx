import { Button, Icon, Modal, Typography } from '@social/ui-shared';

interface CheckContentProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShow2: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentCheck({ setShow, setShow2 }: CheckContentProps) {
  return (
    <>
      <Typography.Body className="text-opacity-60 mt-4" variant="medium">
        If you do, you will lose the content.
      </Typography.Body>
      <div className="flex gap-4 my-6">
        <Button.Large variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          onClick={() => {
            setShow(false);
            setShow2(false);
          }}
          icon={<Icon.ArrowRight size="16" />}
        >
          Continue
        </Modal.SubmitAction>
      </div>
    </>
  );
}
