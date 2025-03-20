'use client';

import { Button, Icon, Input, Modal, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts/_pubky';
import { PubkyAppUser } from 'pubky-app-specs';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';

interface InputReportProps {
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  sent: boolean;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
  profile: PubkyAppUser | undefined;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  loading: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  name: string | undefined;
  pk: string;
}

export default function InputReport({
  error,
  setError,
  sent,
  setSent,
  profile,
  message,
  setMessage,
  handleSubmit,
  loading,
  setShowModal,
  name,
  pk
}: InputReportProps) {
  const { pubky } = usePubkyClientContext();

  return (
    <>
      {!sent && !error && (
        <>
          <Modal.Header title="Report User" />
          <Typography.Body className="text-left my-6" variant="medium">
            <span className="opacity-80">Please describe the reason why you&apos;re reporting </span>
            <Link href={`/profile/${pk}`} className="font-bold hover:underline hover:decoration-solid">
              {Utils.minifyText(name ?? pk, 20)}
            </Link>
            .
          </Typography.Body>
          <div className="p-6 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
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
              placeholder="Why are you reporting?"
              className="w-full max-h-[300px] h-auto mt-4"
            />
            <div className="w-full flex gap-3 mt-3 justify-end">
              <div className="text-opacity-30 text-white text-sm mt-4 mr-2">{message.length} / 1000</div>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button.Large id="cancel-report" onClick={() => setShowModal(false)} variant="secondary">
              Cancel
            </Button.Large>
            <Button.Large disabled={!message} loading={loading} onClick={() => (message ? handleSubmit() : undefined)}>
              Report User
            </Button.Large>
          </div>
        </>
      )}
      {(sent || error) && (
        <>
          <Modal.Header title={error ? 'Sent Failed' : 'Report Sent'} />
          <Typography.Body className="text-left text-opacity-60 mt-2 mb-6" variant="medium">
            {error ? 'Report not sent correctly, please try again.' : 'Your report will be reviewed soon. Thank you.'}
          </Typography.Body>
          <div className="flex gap-4">
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
