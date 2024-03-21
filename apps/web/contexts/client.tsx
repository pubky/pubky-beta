/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { argon2id } from 'hash-wasm';

import { Client } from '@pubky/client/src/lib/client.js'; // browser bundle default export issue
import z32 from 'z32';

import { IProfile } from '@pubky/client/src/lib/social/profile';
import { Profile } from '../app/onboarding/sign-up/page';

export type PubkyProfile = IProfile;
export * from '@pubky/common';

const DEFAULT_HOME_SERVER = 'http://localhost:7259';
const DEFAULT_RELAY = 'https://relay.pkarr.org';

const SPEC_DOMAIN = 'pubky.org/';
const SPEC_NAME = 'recovery';
const SPEC_LINK = SPEC_DOMAIN + SPEC_NAME;
const SPEC_VERSION = 0;

const SPEC = SPEC_LINK + '#v' + SPEC_VERSION;

type ClientContextType = {
  signUp: () => Promise<string>;
  logout: (sessions: any) => Promise<void>;
  getProfile: () => Promise<PubkyProfile>;
  saveProfile: (profile: Profile) => Promise<void>;
  pubky: string;
};

const ClientContext = createContext<ClientContextType>({
  signUp: async () => {},
  logout: async () => {},
  getProfile: async () => {},
  saveProfile: async () => {},
  pubky: undefined,
});

export function ClientWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [pubky, setPubky] = useState<string>('');

  const client = useMemo(() => {
    return new Client(DEFAULT_HOME_SERVER, {
      relay: DEFAULT_RELAY,
      homeserverUrl: DEFAULT_HOME_SERVER,
    });
  }, []);

  const isLoggedIn = useCallback(async (): Promise<boolean> => {
    await client.ready();
    const sessions = await client.session();
    const users = Object.keys(sessions?.users);
    if (!users.length) return false;
    const pubky = users[0];
    setPubky(pubky);
    return pubky;
  }, [client]);

  const signUp = useCallback(async (): Promise<string> => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      const seed = Client.crypto.generateSeed();
      const result = await client.signup(seed); // seed is zeroed
      if (!result.ok) throw new Error(`Signup failed: ${result.error.message}`);
      const newPubky = result.value;
      setPubky(newPubky);
      console.log(`Signup success: ${newPubky}`);

      // DEMO: generate recovery file content
      const encryptionKey = await _encryptionKeyFromPassphrase('password');
      const encryptedSeed = await Client.crypto.encrypt(seed, encryptionKey);
      const recovery = SPEC + '\n' + z32.encode(encryptedSeed);
      console.log(`Recovery: ${recovery}`);

      return newPubky;
    }
    return loggedIn;
  }, [client, isLoggedIn]);

  const logout = useCallback(
    async (session: any) => {
      await client.ready();
      Object.keys(session.users).map(async (pubky) => {
        const result = await client.logout(pubky);
        if (!result.ok)
          throw new Error(
            `Logout pubky:${pubky} failed: ${result.error.message}`
          );
      });
    },
    [client]
  );

  const saveProfile = useCallback(
    async (profile: Profile): Promise<void> => {
      const pk = await isLoggedIn();
      if (!pk) throw new Error('Save profile failed: not logged in.');
      const pubkyProfile = _toPubkyProfile(profile);
      const result = await client.social.profile.put(pk, pubkyProfile);
      if (!result.ok)
        throw new Error(
          `Save pubky:${pk} profile failed: ${result.error.message}`
        );
      console.log(
        `Saved pubky:${pk} profile: ${JSON.stringify(pubkyProfile, null, 2)}`
      );
    },
    [client, isLoggedIn]
  );

  const getProfile = useCallback(async (): Promise<PubkyProfile> => {
    const pk = await isLoggedIn();
    if (!pk) throw new Error('Get profile failed: not logged in.');
    console.log('pk', pk);
    const result = await client.social.profile.get(pk);
    console.log(result);
    if (!result.ok)
      throw new Error(
        `Get pubky:${pk} profile failed: ${result.error.message}`
      );
    const pubkyProfile = result.value;
    console.log(
      `Got pubky:${pk} profile: ${JSON.stringify(pubkyProfile, null, 2)}`
    );
    return pubkyProfile;
  }, [client, isLoggedIn]);

  return (
    <ClientContext.Provider
      value={{ signUp, logout, getProfile, saveProfile, pubky }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientContext);
}

const _encryptionKeyFromPassphrase = async (password: string) => {
  return argon2id({
    password,
    salt: 'recovery',
    // Options are a copy of https://crates.io/crates/argon2 defaults
    iterations: 2,
    parallelism: 1,
    memorySize: 19 * 1024, // 19mb
    hashLength: 32,
    outputType: 'binary',
  });
};

const _toPubkyProfile = (profile: Profile): PubkyProfile => {
  if (!profile) throw new Error('Profile is required');
  const pubkyProfile: PubkyProfile = {
    name: profile.name || 'anonymous',
    bio: profile.info,
    image: profile.image || '/images/Userpic.png',
    links: [
      { url: profile.links.website, title: 'website' },
      { url: profile.links.email, title: 'email' },
      { url: profile.links.x, title: 'x' },
      { url: profile.links.telegram, title: 'telegram' },
    ],
  };
  return pubkyProfile;
};
