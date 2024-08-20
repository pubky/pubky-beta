'use client';

import { useClientContext } from '@/contexts';
import { IProfile } from '@/types';
import { Icon, Input, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';
import { ImageByUri } from '../ImageByUri';
import axios from 'axios';

export default function Feedback() {
  const { pubky, getProfile } = useClientContext();
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<IProfile>();

  async function fetchProfile() {
    try {
      const userProfile = await getProfile();
      if (userProfile) {
        setProfile(userProfile);
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
      await axios.post('https://synonym.to/api/chatwoot', {
        message,
        email: 'feedback@pubky.app',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="self-start sticky top-[120px] col-span-1">
      <SideCard.Header title="Feedback" />
      <SideCard.Content>
        <div className="p-6 w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
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
            <Input.TextArea
              defaultValue={message}
              onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                const target = e.target as HTMLTextAreaElement;
                setMessage(target.value);
              }}
              placeholder="What do you think about Pubky? Any suggestions?"
            />
          </div>
        </div>
        <SideCard.Action
          icon={<Icon.Envelope size="16" color="gray" />}
          disabled={!message}
          onClick={() => (message ? handleSubmit() : undefined)}
          className="mt-4"
          text="Submit application"
        />
      </SideCard.Content>
    </div>
  );
}
