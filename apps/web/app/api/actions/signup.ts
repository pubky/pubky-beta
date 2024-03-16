'use server';

import Client from '@pubky/client';
import { IProfile as PubkyProfile } from '@pubky/client/src/lib/social/profile';

import { Profile } from '../../onboarding/sign-up/page';
import { toPubkyProfile } from './profile';

import { DEFAULT_HOME_SERVER, DEFAULT_RELAY } from './constants';

export async function signup(
  profile?: Profile
): Promise<{ pk: string; profile?: PubkyProfile }> {
  // TODO: reuse user client session
  const pubkyClient = new Client(DEFAULT_HOME_SERVER, {
    relay: DEFAULT_RELAY,
    homeserverUrl: DEFAULT_HOME_SERVER,
  });
  await pubkyClient.ready().then(() => {
    console.log('Pubky client is ready.');
  });
  const signupResult = await pubkyClient.signup(Client.crypto.generateSeed());
  if (!signupResult.ok)
    throw new Error(`Signup failed: ${signupResult.error.message}`);
  const pk = signupResult.value;
  console.log(`Signup successful: ${pk}`);
  if (profile) {
    const pubkyProfile = toPubkyProfile(profile);
    const putProfileResult = await pubkyClient.social.profile.put(
      pk,
      pubkyProfile
    );
    if (!putProfileResult.ok)
      throw new Error(
        `Save onboarding profile failed: ${putProfileResult.error.message}`
      );
    console.log('Saved onboarding profile.');
    const getProfileResult = await pubkyClient.social.profile.get(pk);
    if (!getProfileResult.ok)
      throw new Error(
        `Get onboarding profile failed: ${getProfileResult.error.message}`
      );
    return { pk, profile: getProfileResult.value };
  }
  return { pk };
}
