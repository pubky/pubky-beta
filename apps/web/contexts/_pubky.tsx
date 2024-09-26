// src/components/PubkyClientWrapper.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState } from 'react';
import {
  PubkyClient,
  PublicKey,
  decryptRecoveryFile,
  Keypair,
} from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';

interface Links {
  [key: string]: {
    title: string;
    url: string;
  };
}
export interface PubkyAppUser {
  name: string;
  bio?: string;
  image?: string | File;
  links?: Links | any;
  status?: string;
}

const HOMESERVER_PUBLIC_KEY =
  '8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo';

const client = PubkyClient.testnet();
const homeserver = PublicKey.from(HOMESERVER_PUBLIC_KEY);

type PubkyClientContextType = {
  pubky: string | undefined;
  seed: string | undefined;
  setSeed: (seed: string | undefined) => void;
  profile: PubkyAppUser | undefined;
  loginWithFile: (password: string, recoveryFile: Buffer) => Promise<string>;
  isLoggedIn: () => Promise<boolean>;
  logout: () => boolean;
  signUp: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  getProfile: (profilePublicKey: string) => Promise<PubkyAppUser | null>;
  saveProfile: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
};

const PubkyClientContext = createContext({} as PubkyClientContextType);

export function PubkyClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pubky, setPubky] = useState<string | undefined>(
    (Utils.storage.get('pubky_public_key') as string) || undefined
  );
  const [seed, setSeed] = useState<string | undefined>(
    (Utils.storage.get('seed') as string | undefined) || undefined
  );
  const [profile, setProfile] = useState<PubkyAppUser | undefined>(
    (Utils.storage.get('profile') as PubkyAppUser | undefined) || undefined
  );

  const logout = () => {
    try {
      if (pubky) {
        // Logout client
        client.signout(PublicKey.from(pubky));
      }

      // Clear storage and states
      Utils.storage.remove('pubky_public_key');
      Utils.storage.remove('seed');
      Utils.storage.remove('profile');
      setPubky(undefined);
      setSeed(undefined);
      setProfile(undefined);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isLoggedIn = async () => {
    if (!pubky) return false;

    const session = await client.session(PublicKey.from(pubky));

    if (!session) {
      Utils.storage.remove('pubky_public_key');
      setPubky(undefined);
      return false;
    }

    return true;
  };

  const loginWithFile = async (password: string, recoveryFile: Buffer) => {
    try {
      const keypair = decryptRecoveryFile(recoveryFile, password);

      if (!keypair) {
        throw new Error('Invalid recovery file');
      }

      // Sign up
      await client.signup(keypair, homeserver);

      // Get session
      const session = await client.session(keypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // Save pubky state
      const pk = session.pubky().z32();
      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);

      // Retrieve and save the profile
      const fetchedProfile = await getProfile(pk);
      if (fetchedProfile) {
        Utils.storage.set('profile', JSON.stringify(fetchedProfile));
        setProfile(fetchedProfile);
      } else {
        throw new Error('Failed to retrieve profile');
      }

      return session.pubky().z32();
    } catch (error: any) {
      // Get error message and return as a string
      console.log(error);
      throw new Error(error.message);
    }
  };

  const signUp = async (userProfile: PubkyAppUser): Promise<any | false> => {
    try {
      const newKeypair = Keypair.random();

      const seed = Utils.uint8ArrayToBase64(newKeypair.secretKey());

      Utils.storage.set('seed', seed);
      setSeed(seed);

      // Sign up
      await client.signup(newKeypair, homeserver);

      // Get session
      const session = await client.session(newKeypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // Save pubky state
      const pk = session.pubky().z32();
      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);

      // Transform the profile to the PubkyAppUser format
      const pubkeyProfile: PubkyAppUser = toPubkeyProfile(userProfile);

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(pubkeyProfile));
      setProfile(pubkeyProfile);

      // Serialize to JSON and convert to Buffer
      const body = Buffer.from(JSON.stringify(pubkeyProfile));

      // Profile URL (fixed address)
      const profileUrl = `pubky://${pk}/pub/pubky.app/profile.json`;

      // Send the profile to the homeserver
      await client.put(profileUrl, body);

      const fetchedProfile = await getProfile(pk);

      return fetchedProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const saveProfile = async (
    userProfile: PubkyAppUser
  ): Promise<any | false> => {
    try {
      const loggedIn = isLoggedIn();

      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      // Transform the profile to the PubkyAppUser format
      const pubkeyProfile: PubkyAppUser = toPubkeyProfile(userProfile);

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(pubkeyProfile));
      setProfile(pubkeyProfile);

      // Serialize to JSON and convert to Buffer
      const body = Buffer.from(JSON.stringify(pubkeyProfile));

      // Profile URL (fixed address)
      const profileUrl = `pubky://${pubky}/pub/pubky.app/profile.json`;

      // Send the profile to the homeserver
      await client.put(profileUrl, body);

      const fetchedProfile = await getProfile(pubky as string);

      return fetchedProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getProfile = async (
    profilePublicKey: string
  ): Promise<PubkyAppUser | null> => {
    const profileUrl = `pubky://${profilePublicKey}/pub/pubky.app/profile.json`;

    try {
      const response = await client.get(profileUrl);
      if (response) {
        const profileJson = Buffer.from(response).toString('utf-8');
        return JSON.parse(profileJson);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return null;
    }
  };

  const toPubkeyProfile = (profile: PubkyAppUser): PubkyAppUser => {
    if (!profile) throw new Error('Profile is required');

    const linksArray = Object.entries(profile.links || {}).map(
      ([title, url]) => ({
        title,
        url,
      })
    );

    return {
      name: profile.name || 'anonymous',
      bio: profile.bio || '',
      image: profile.image,
      links: linksArray.length > 0 ? linksArray : undefined,
      status: profile.status || 'noStatus',
    };
  };

  return (
    <PubkyClientContext.Provider
      value={{
        pubky,
        seed,
        profile,
        loginWithFile,
        isLoggedIn,
        logout,
        signUp,
        setSeed,
        getProfile,
        saveProfile,
      }}
    >
      {children}
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
