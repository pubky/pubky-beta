'use client';

import { SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import { ImageByUri } from '../ImageByUri';
import axios from 'axios';
import Modal from '../Modal';
import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';

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
      await axios.post('/api/chatwoot', {
        message,
        name: profile?.name,
        email: `${pubky}@pubky.app`,
        source: 'Feedback',
      });
      setSent(true);
      setLoading(false);
      setMessage('');
    } catch (error) {
      console.error(error);
      setError(true);
      setLoading(false);
    }
  };

  if (!pubky) return;

  return (
    <>
      <div className="col-span-1">
        <SideCard.Header title="Feedback" />
        <SideCard.Content className="mt-3">
          <div className="p-5 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
            <div className="flex flex-col gap-3">
              <Link href="/profile" className="flex gap-1 items-center">
                <ImageByUri
                  alt="user"
                  uri={profile?.image ?? '/images/webp/Userpic.webp'}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <Typography.Body
                  variant="medium-bold"
                  className="hover:underline hover:decoration-solid"
                >
                  {Utils.minifyText(
                    profile?.name ?? Utils.minifyPubky(pubky ?? ''),
                    10,
                  )}
                </Typography.Body>
              </Link>
              <div
                className="cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <Typography.Body
                  className="text-opacity-30 leading-snug tracking-wide"
                  variant="medium"
                >
                  What do you think about Pubky? Any suggestions?
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
