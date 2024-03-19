/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

'use client';

import { createContext, useContext, useState } from 'react';
import { Client } from '@pubky/sdk';
export * from '@pubky/common';

const TEST_HOMESERVER =
  'pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo';
const TEST_PKARR_RELAY = 'http://localhost:7258';

type ClientContextType = {
  signUp: () => Promise<any>;
  logout: (sessions: any) => Promise<any>;
  pubKey: string;
  getProfile: () => Promise<any>;
  saveProfile: (profile: any) => Promise<any>;
};

const ClientContext = createContext<ClientContextType>({
  signUp: async () => '',
  logout: async () => '',
  pubKey: '',
  getProfile: async () => '',
  saveProfile: async () => '',
});

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubKey, setPubKey] = useState('');

  const client = new Client(TEST_HOMESERVER, {
    relay: TEST_PKARR_RELAY,
  });

  const logout = async (session: any) => {
    await client.ready();

    Object.keys(session.users).map(async (id) => {
      await client.logout(id);
    });
  };

  const refreshPubKey = async () => {
    await client.ready();

    const sessions = await client.session();
    const pubkey = Object.keys(sessions.users)[0];
    setPubKey(pubkey);
    return pubkey;
  };

  const isLoggedIn = async () => {
    await client.ready();

    const sessions = await client.session();
    return Object.keys(sessions.users).length > 0;
  };

  const signUp = async () => {
    await client.ready();

    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      const seed = Client.crypto.generateSeed();
      await client.signup(seed);
    }
    return await refreshPubKey();
  };

  const saveProfile = async (profileInfo) => {
    await client.ready();

    const pk = await refreshPubKey();
    return await client.social.profile.put(pk, profileInfo);
  };

  const getProfile = async () => {
    await client.ready();
    const userId = await refreshPubKey();

    return await client.social.profile.get(userId);
  };

  return (
    <ClientContext.Provider
      value={{ signUp, logout, pubKey, getProfile, saveProfile }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientContext);
}
