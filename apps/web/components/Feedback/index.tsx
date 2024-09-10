'use client';

import { useClientContext } from '@/contexts';
import { IProfile } from '@/types';
import { Input, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';
import { ImageByUri } from '../ImageByUri';
import axios from 'axios';
import Modal from '../Modal';
import { useRouter } from 'next/navigation';

export default function Feedback() {
  const router = useRouter();
  const { pubky, getProfile } = useClientContext();
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<IProfile>();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState('');

  async function fetchProfile() {
    try {
      const userProfile = await getProfile();
      if (userProfile) {
        setProfile(userProfile);
        setName(userProfile?.name);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('https://synonym.to/api/chatwoot', {
        message,
        name: name,
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
              <div
                onClick={() => router.push('/profile')}
                className="flex gap-2 items-center cursor-pointer"
              >
                <ImageByUri
                  alt="user"
                  uri={profile?.image ?? '/images/Userpic.png'}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <Typography.Body variant="medium-bold">
                  {Utils.minifyText(profile?.name ?? 'Loading...', 10)}
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
          {/**
        <SideCard.Action
          icon={<Icon.Envelope size="16" color="gray" />}
          disabled={!message}
          onClick={() => (message ? handleSubmit() : undefined)}
          className="mt-4"
          text="Submit Feedback"
        />
        */}
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
