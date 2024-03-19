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

  // === Ar Example ===
  const dostuff = async () => {
    await client.ready()

    const seed = Client.crypto.generateSeed()

    let signupResult = await client.signup(seed)
    if (signupResult.isErr()) throw signupResult.error

    // Clear the seed after use, non necessary, but good for security
    client.crypto.zeroize(seed)

    // No need to call client.session(), we have the userId from the response
    const userId = signupResult.value
    console.log("Signed up as user", { userId })

    const profile = { name: "foo" }
    const putResult = await client.social.profile.put(userId, profile)
    if (putResult.isErr()) throw putResult.error

    const resolvedResult = await client.social.profile.get(userId)
    if (resolvedResult.isErr()) throw resolvedResult.error
    const resolved = resolvedResult.value

    console.log("Resolved user profile", resolved);
  }
  // === END ===

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
      value={{ signUp, logout, pubKey, getProfile, saveProfile, dostuff }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientContext);
}
