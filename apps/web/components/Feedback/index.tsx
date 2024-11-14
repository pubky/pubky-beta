'use client';

import { Input, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import { ImageByUri } from '../ImageByUri';
import axios from 'axios';
import Modal from '../Modal';
import { usePubkyClientContext } from '@/contexts';

export default function Feedback() {
  const { pubky, profile } = usePubkyClientContext();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('https://synonym.to/api/chatwoot', {
        message,
        name: profile?.name,
        email: `${pubky}@pubky.app`,
        source: 'pubky',
      });
      setSent(true);
      //setShowModal(true);
      setLoading(false);
      setMessage('');
    } catch (error) {
      console.error(error);
      setError(true);
      //setShowModal(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="self-start sticky top-[120px] col-span-1">
        <SideCard.Header title="Feedback" />
        <SideCard.Content>
          <div className="p-6 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <ImageByUri
                  alt="user"
                  uri={profile?.image ?? '/images/webp/Userpic.webp'}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <Typography.Body variant="medium-bold">
                  {Utils.minifyText(
                    profile?.name ?? Utils.minifyPubky(pubky ?? ''),
                    10
                  )}
                </Typography.Body>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <Input.TextArea
                  //value={message}
                  className="pointer-events-none"
                  //onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  //  const target = e.target as HTMLTextAreaElement;
                  //  setMessage(target.value);
                  //}}
                  placeholder="What do you think about Pubky? Any suggestions?"
                />
              </div>
            </div>
          </div>
        </SideCard.Content>
      </div>
      <Modal.Feedback
        showModal={showModal}
        setShowModal={setShowModal}
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
    </>
  );
}
