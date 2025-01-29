'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentFeedback from '../Modal/_Feedback/_Content';
import { PubkyAppUser } from 'pubky-app-specs';

interface FeedbackProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  sent: boolean;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
  profile: PubkyAppUser | undefined;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  loading: boolean;
  title?: string;
  className?: string;
}

export default function Feedback({
  show,
  setShow,
  error,
  setError,
  sent,
  setSent,
  profile,
  message,
  setMessage,
  handleSubmit,
  loading,
  title,
  className,
}: FeedbackProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentFeedback
        setShowModal={setShow}
        error={error}
        setError={setError}
        sent={sent}
        setSent={setSent}
        profile={profile}
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </BottomSheet.Root>
  );
}
