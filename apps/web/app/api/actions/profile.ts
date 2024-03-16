'use server';

import Client from '@pubky/client';
import { IProfile as PubkyProfile } from '@pubky/client/src/lib/social/profile';

import { Profile } from '../../onboarding/sign-up/page';

import { DEFAULT_HOME_SERVER, DEFAULT_RELAY } from './constants';

export const toPubkyProfile = (profile: Profile): PubkyProfile => {
  if (!profile) throw new Error('Profile is required');
  const pubkyProfile: PubkyProfile = {
    name: profile.name,
    bio: profile.info,
    image: '<convert_me_to_base64_instead>',
    links: [
      { url: profile.links.website, title: 'website' },
      { url: profile.links.email, title: 'email' },
      { url: profile.links.x, title: 'x' },
      { url: profile.links.telegram, title: 'telegram' },
    ],
  };
  return pubkyProfile;
};

export async function put(pk: string, profile: Profile): Promise<void> {
  if (!pk) throw new Error('Save profile failed: userId required.');
  // TODO: reuse user client session
  const pubkyClient = new Client(DEFAULT_HOME_SERVER, {
    relay: DEFAULT_RELAY,
    homeserverUrl: DEFAULT_HOME_SERVER,
  });
  await pubkyClient.ready();
  const pubkyProfile = toPubkyProfile(profile);
  const result = await pubkyClient.social.profile.put(pk, pubkyProfile);
  if (!result.ok)
    throw new Error(`Save profile failed: ${result.error.message}`);
}

export async function get(pk: string): Promise<Profile> {
  if (!pk) throw new Error('Get profile failed: userId required.');
  // TODO: reuse user client session
  const pubkyClient = new Client(DEFAULT_HOME_SERVER, {
    relay: DEFAULT_RELAY,
    homeserverUrl: DEFAULT_HOME_SERVER,
  });
  await pubkyClient.ready();
  const result = await pubkyClient.social.profile.get(pk);
  if (!result.ok)
    throw new Error(`Get profile failed: ${result.error.message}`);
  return result.value;
}
