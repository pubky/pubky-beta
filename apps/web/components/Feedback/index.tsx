'use client';

import { SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import { ImageByUri } from '../ImageByUri';
import axios from 'axios';
import Modal from '../Modal';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';

export default function Feedback() {
  const { pubky } = usePubkyClientContext();
  const { data } = useUserProfile(pubky ?? '');
  const profile = data;
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
        name: profile?.details?.name,
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
                  uri={profile?.details?.image ?? '/images/Userpic.png'}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <Typography.Body variant="medium-bold">
                  {Utils.minifyText(profile?.details?.name ?? 'Loading...', 10)}
                </Typography.Body>
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
