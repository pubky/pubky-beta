import { Button, Icon, Modal, Typography } from '@social/ui-shared';

interface DraftProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentDraft({ setShow, setClose }: DraftProps) {
  return (
    <>
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        If you proceed you will lose your changes
      </Typography.Body>
      <div className="flex gap-4">
        <Button.Large variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          onClick={() => {
            setShow(false);
            setClose(false);
          }}
          icon={<Icon.ArrowRight size="16" />}
        >
          Continue
        </Modal.SubmitAction>
      </div>
    </>
  );
}
