'use client';

import {
  BottomSheet,
  Button,
  Icon,
  Input,
  Typography,
} from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { PubkyAppUser } from '@/types/Post';
import { ImageByUri } from '../ImageByUri';
import Link from 'next/link';

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
  const { pubky } = usePubkyClientContext();

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      {!sent && !error && (
        <>
          <Typography.H2>Provide Feedback</Typography.H2>
          <div className="mt-6 p-6 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
            <div className="justify-start items-center gap-3 flex">
              <ImageByUri
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                alt="user-image"
                uri={profile?.image ?? '/images/webp/Userpic.webp'}
              />
              {pubky ? (
                <Link
                  className="cursor-pointer flex gap-4 items-center"
                  href="/profile"
                >
                  <Typography.Body
                    className={`hover:underline hover:decoration-solid`}
                    variant="medium-bold"
                  >
                    {Utils.minifyText(
                      profile?.name ?? Utils.minifyPubky(pubky),
                      24,
                    )}
                  </Typography.Body>
                  <div className="flex gap-1 cursor-pointer">
                    {/**<Icon.CheckCircle size="16" color="gray" />*/}
                    <Typography.Label className="text-opacity-30">
                      {Utils.minifyPubky(pubky)}
                    </Typography.Label>
                  </div>
                </Link>
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
          <Typography.H2>
            {error ? 'Sent Failed' : 'Feedback Received'}
          </Typography.H2>
          <Typography.Body className="text-opacity-60" variant="medium">
            {error
              ? 'Feedback not sent correctly, please try again.'
              : 'Thank you for helping us improve Pubky.'}
          </Typography.Body>
          <div className="flex gap-4 mt-8">
            <Button.Large
              icon={
                error ? <Icon.Warning size="16" /> : <Icon.Check size="16" />
              }
              onClick={() => {
                if (error) {
                  setError(false);
                } else {
                  setSent(false);
                  setShow(false);
                }
              }}
            >
              {error ? 'Try again' : "You're welcome!"}
            </Button.Large>
          </div>
        </>
      )}
    </BottomSheet.Root>
  );
}
