import { Icon, Modal, Typography } from '@social/ui-shared';

export default function ConnectionLost() {
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <>
      <Typography.Body className="text-opacity-60" variant="medium">
        You may have lost your connection. Please check it and try again.
      </Typography.Body>
      <Modal.SubmitAction className="mt-4" icon={<Icon.Repost size="16" />} onClick={handleTryAgain}>
        Try again
      </Modal.SubmitAction>
    </>
  );
}
