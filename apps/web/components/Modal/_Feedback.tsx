'use client';

import { Button, Icon, Input, Modal, Typography } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import { ImageByUri } from '../ImageByUri';
import { Utils } from '@social/utils-shared';
import { useClientContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { PubkyAppUser } from '@/contexts/_pubky';

interface FeedbackProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  sent: boolean;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
  profile: PubkyAppUser | undefined;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Feedback({
  showModal,
  setShowModal,
  error,
  setError,
  sent,
  setSent,
  profile,
  message,
  setMessage,
  handleSubmit,
  loading,
}: FeedbackProps) {
  const { pubky } = useClientContext();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal]);
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="w-[792px] max-h-[600] overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      {!sent && !error && (
        <>
          <Modal.Header title="Provide Feedback" />
          <div className="mt-6 p-6 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
            <div className="justify-start items-center gap-3 flex">
              <ImageByUri
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                alt="user-image"
                uri={profile?.image ?? '/images/Userpic.png'}
              />
              {profile?.name && pubky ? (
                <div
                  className="cursor-pointer flex gap-4 items-center"
                  onClick={() => router.push('/profile')}
                >
                  <Typography.Body
                    className={`hover:underline hover:decoration-solid`}
                    variant="medium-bold"
                  >
                    {Utils.minifyText(profile?.name, 24)}
                  </Typography.Body>
                  <div className="flex gap-1 cursor-pointer">
                    {/**<Icon.CheckCircle size="16" color="gray" />*/}
                    <Typography.Label className="text-opacity-30">
                      {Utils.minifyPubky(pubky)}
                    </Typography.Label>
                  </div>
                </div>
              ) : (
                <Typography.Body
                  variant="medium-bold"
                  className="text-opacity-50"
                >
                  Loading...
                </Typography.Body>
              )}
            </div>
            <Input.CursorArea
              autoFocus
              maxLength={1000}
              value={message}
              onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                const target = e.target as HTMLTextAreaElement;
                setMessage(target.value);
              }}
              placeholder="What do you think about Pubky? Any suggestions?"
              className="w-full max-h-[300px] h-auto mt-4"
            />
            <div className="w-full flex gap-3 mt-3 justify-end">
              <div className="text-opacity-30 text-white text-sm mt-4 mr-2">
                {message.length} / 1000
              </div>
              <Button.Medium
                className="w-auto"
                variant="line"
                icon={
                  <Icon.PaperPlaneRight
                    size="16"
                    color={message ? 'white' : 'gray'}
                  />
                }
                disabled={!message}
                loading={loading}
                onClick={() => (message ? handleSubmit() : undefined)}
              >
                Send
              </Button.Medium>
            </div>
          </div>
        </>
      )}
      {(sent || error) && (
        <>
          <Modal.Header title={error ? 'Sent Failed' : 'Feedback Received'} />
          <Typography.Body className="text-opacity-60" variant="medium">
            {error
              ? 'Feedback not sent correctly, please try again.'
              : 'Thank you for helping us improve Pubky.'}
          </Typography.Body>
          <div className="flex gap-4 mt-8">
            <Modal.SubmitAction
              icon={
                error ? <Icon.Warning size="16" /> : <Icon.Check size="16" />
              }
              onClick={() => {
                if (error) {
                  setError(false);
                } else {
                  setSent(false);
                  setShowModal(false);
                }
              }}
            >
              {error ? 'Try again' : "You're welcome!"}
            </Modal.SubmitAction>
          </div>
        </>
      )}
    </Modal.Root>
  );
}
