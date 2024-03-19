/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

'use client';

import { createContext, useContext, useState } from 'react';
import Client from '@pubky/sdk';
export * from '@pubky/common';

const TEST_HOMESERVER =
  'pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo';
const TEST_PKARR_RELAY = 'http://localhost:7258';

type ClientContextType = {
  getProfile: () => Promise<any>;
  saveProfile: (profile: any) => Promise<any>;
  profile: any;
};

const ProfileContext = createContext<ClientContextType>({
  getProfile: async () => '',
  saveProfile: async () => '',
  profile: {},
});

export function ProfileWrapper({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState();
  const [pubKey, setPubKey] = useState();

  const client = new Client(TEST_HOMESERVER, {
    relay: TEST_PKARR_RELAY,
  });

  const getUserId = async () => {
    if (pubKey) return pubKey;
    await client.ready();
    const sessions = await client.session();
    const pubkey = Object.keys(sessions.users)[0];
    setPubKey(pubkey);
    return pubkey;
  };

  const saveProfile = async (profileInfo) => {
    await client.ready();
    const userId = await getUserId();
    const putResult = await client.social.profile.put(userId, profileInfo);
    if (putResult.isErr()) return false;
    setProfile(profileInfo);
    return true;
  };

  const getProfile = async () => {
    if (profile) return profile;
    await client.ready();
    const userId = await getUserId();
    const resolvedResult = await client.social.profile.get(userId);
    if (resolvedResult.isErr()) return {};
    return resolvedResult.value;
  };

  return (
    <ProfileContext.Provider value={{ getProfile, saveProfile, profile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  return useContext(ProfileContext);
}
