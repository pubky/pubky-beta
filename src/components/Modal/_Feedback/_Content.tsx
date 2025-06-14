'use client';

import { Button, Icon, Input, Modal, Typography } from '@social/ui-shared';

import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts/_pubky';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { useState } from 'react';
import axios from 'axios';
import { useAlertContext } from '@/contexts';

interface FeedbackProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentFeedback({ setShowModal }: FeedbackProps) {
  const { pubky, profile } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('/api/chatwoot', {
        message,
        name: profile?.name,
        email: `${pubky}@pubky.app`,
        source: 'Feedback'
      });
      setSent(true);
      setLoading(false);
      setMessage('');
    } catch (error) {
      console.error(error);
      addAlert('Something wrong. Try again', 'warning');
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      {!sent && !error && (
        <>
          <Modal.Header title="Provide Feedback" />
          <div className="mt-6 p-6 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
            <div className="justify-start items-center gap-3 flex">
              <ImageByUri
                id={pubky}
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                alt="user-image"
              />
              {pubky ? (
                <Link className="cursor-pointer flex gap-4 items-center" href="/profile">
                  <Typography.Body className={`hover:underline hover:decoration-solid`} variant="medium-bold">
                    {Utils.minifyText(profile?.name ?? Utils.minifyPubky(pubky), 24)}
                  </Typography.Body>
                  <div className="flex gap-1 cursor-pointer">
                    {/**<Icon.CheckCircle size="16" color="gray" />*/}
                    <Typography.Label className="text-opacity-30">{Utils.minifyPubky(pubky)}</Typography.Label>
                  </div>
                </Link>
              ) : (
                <Typography.Body variant="medium-bold" className="text-opacity-50">
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
              placeholder="What do you think about Pubky?"
              className="w-full max-h-[300px] h-auto mt-4"
            />
            <div className="w-full flex gap-3 mt-3 justify-end">
              <div className="text-opacity-30 text-white text-sm mt-4 mr-2">{message.length} / 1000</div>
              <Button.Medium
                className="w-auto"
                variant="line"
                icon={<Icon.PaperPlaneRight size="16" color={message ? 'white' : 'gray'} />}
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
          <Typography.Body className="text-opacity-60 mt-2" variant="medium">
            {error ? 'Feedback not sent correctly, please try again.' : 'Thank you for helping us improve Pubky.'}
          </Typography.Body>
          <div className="flex gap-4 mt-8">
            <Modal.SubmitAction
              icon={error ? <Icon.Warning size="16" /> : <Icon.Check size="16" />}
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
    </>
  );
}
