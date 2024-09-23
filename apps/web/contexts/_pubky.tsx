/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState } from 'react';

import { PubkyClient, PublicKey, decryptRecoveryFile } from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';

const HOMESERVER_PUBLIC_KEY =
  '8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo';

const client = PubkyClient.testnet();

type PubkyClientContextType = {
  pubky: string | undefined;
  loginWithFile: (password: string, recoveryFile: Buffer) => Promise<string>;
  isLoggedIn: () => Promise<boolean>;
  logout: () => boolean;
  signUp: (userProfile: any) => Promise<any>;
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

  const logout = () => {
    try {
      // clear storage and states
      Utils.storage.remove('pubky_public_key');
      setPubky(undefined);

      // logout client
      client.signout(PublicKey.from(pubky));

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

      const homeserver = PublicKey.from(HOMESERVER_PUBLIC_KEY);

      // sign up
      await client.signup(keypair, homeserver);

      // get session
      const session = await client.session(keypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // save pubky state
      Utils.storage.set('pubky_public_key', session?.pubky().z32());
      setPubky(session?.pubky().z32());

      // TODO: get profile and save to storage
      // const profile = await getProfile();

      // if (profile) {
      //   Utils.storage.set('pubky', result.value);
      //   setPubky(result.value);
      // }

      // return profile;

      return session?.pubky().z32();
    } catch (error: any) {
      // get error message and return as a string
      console.log(error);
      throw new Error(error.message);
    }
  };

  const signUp = async (userProfile: any) => {
    // try {
    //   const generatedSeed = Client.crypto.generateSeed();
    //   const seed = Utils.uint8ArrayToBase64(generatedSeed);
    //   Utils.storage.set('seed', seed);
    //   setSeed(seed);
    //   await client.ready();
    //   const result = await client.signup(generatedSeed); // seed is zeroed
    //   if (!result.ok) throw new Error(`Signup failed: ${result.error.message}`);
    //   const pk = result.value as unknown as string;
    //   Utils.storage.set('pubky', pk);
    //   setPubky(pk);
    //   if (userProfile.image instanceof File) {
    //     const file = userProfile.image;
    //     const fileContent = await file.arrayBuffer();
    //     const fileUploadResult = await client.social.files.upload(pk, {
    //       content: Buffer.from(fileContent),
    //       contentType: file.type,
    //       size: file.size,
    //     });
    //     if (!fileUploadResult.ok) {
    //       throw new Error(
    //         `File upload failed: ${fileUploadResult.error.message}`
    //       );
    //     }
    //     const { uri } = fileUploadResult.value;
    //     userProfile.image = uri;
    //   }
    //   const pubkeyProfile = _toPubkeyProfile(userProfile);
    //   await client.social.profile.put(pk, pubkeyProfile);
    //   setProfile(pubkeyProfile);
    //   Utils.storage.set('profile', pubkeyProfile);
    //   return pubkeyProfile;
    // } catch (error) {
    //   console.log(error);
    //   return false;
    // }
  };

  return (
    <PubkyClientContext.Provider
      value={{
        pubky,
        loginWithFile,
        isLoggedIn,
        logout,
        signUp,
      }}
    >
      {children}
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
