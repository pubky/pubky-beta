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

type AuthContextType = {
  signUp: () => Promise<any>;
  logout: (sessions: any) => Promise<any>;
  getUserId: () => Promise<any>;
  profile: any;
  getProfile: () => Promise<any>;
  saveProfile: (profile: any) => Promise<any>;
};

const AuthContext = createContext<AuthContextType>({
  signUp: async () => '',
  logout: async () => '',
  pubKey: '',
  profile: {},
  getUserId: async () => '',
});

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [pubKey, setPubKey] = useState();

  const client = new Client(TEST_HOMESERVER, {
    relay: TEST_PKARR_RELAY,
  });

  const logout = async (session: any) => {
    await client.ready();

    Object.keys(session.users).map(async (id) => {
      await client.logout(id);
    });
  };

  const getUserId = async () => {
    if (pubKey) return pubKey;
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
      const signupResult = await client.signup(seed);
      if (signupResult.isErr()) throw signupResult.error;
      Client.crypto.zeroize(seed);
      setPubKey(signupResult.value);
      return signupResult.value;
    }
    return await getUserId();
  };

  return (
    <AuthContext.Provider value={{ signUp, logout, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
