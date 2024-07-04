/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Content,
  Typography,
  Card,
  Button,
  Icon,
  List,
} from '@social/ui-shared';
import { Onboarding } from '../components';
import { useClientContext } from '@/contexts';
import { Skeleton } from '@/components';
import { Utils } from '@social/utils-shared';

export default function Index() {
  const router = useRouter();

  const { pubky, getProfile, listFollowers } = useClientContext();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('/images/Userpic.png');
  const [handler, setHandler] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [telegram, setTelegram] = useState('');
  const [x, setX] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState<
    { alt: string; src: string; name: string; handler: string }[]
  >([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    setHandler(Utils.minifyPubky(pubky));
  }, [pubky]);

  async function fetchProfile() {
    try {
      const userProfile = await getProfile();

      if (userProfile) {
        setImage(userProfile.image || '/images/Userpic.png');
        setName(userProfile.name || '');
        setBio(userProfile.bio || 'No bio.');
        if (userProfile.links) {
          const email = userProfile.links.find(
            (link: { title: string }) => link.title === 'email'
          );
          const x = userProfile.links.find(
            (link: { title: string }) => link.title === 'x'
          );
          const website = userProfile.links.find(
            (link: { title: string }) => link.title === 'website'
          );
          const telegram = userProfile.links.find(
            (link: { title: string }) => link.title === 'telegram'
          );

          setEmail(email?.url || '');
          setX(x?.url || '');
          setWebsite(website?.url || '');
          setTelegram(telegram?.url || '');

          await fetchFollowers();
        }
        setLoading(false);
      } else {
        router.push('/onboarding/register');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchFollowers() {
    try {
      if (!pubky) return;

      const followers = await listFollowers(pubky);

      if (followers) {
        setContacts(
          followers.followers.map((user: any, index: any) => ({
            alt: 'contact-pic-' + (index + 1),
            src: user.profile.image,
            name: user.profile.name,
            handler: Utils.minifyPubky(user.uri.replace('pubky:', '')),
          }))
        );
        setLoadingContacts(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  const profile = {
    name: Utils.minifyText(name),
    handler: handler,
    image: image,
    bio: bio,
    links: {
      email: email,
      website: website,
      x: x,
      telegram: telegram,
    },
  };

  return (
    <Onboarding.Layout currentStep={3}>
      <Typography.Display>
        <span className="flex">
          Welcome,{' '}
          {loading ? (
            <Skeleton.DisplayText className="ml-6 mt-10" />
          ) : (
            Utils.minifyText(name)
          )}
        </span>
      </Typography.Display>
      <Typography.PageTitle className="text-opacity-50 mt-4 lg:mt-0">
        Your contacts and profile information are ready to be used in Pubky.
      </Typography.PageTitle>
      <div className="flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Card.Primary className="min-h-[400px]">
          {loading ? (
            <Skeleton.ProfileCard />
          ) : (
            <Content.Profile profile={profile} />
          )}
        </Card.Primary>
        <Card.Primary title="Contacts" className="justify-start min-h-[400px]">
          {loadingContacts ? (
            <Skeleton.Simple />
          ) : contacts.length > 0 ? (
            <List.Contacts contacts={contacts} />
          ) : (
            <Typography.Body variant="small" className="text-opacity-50 mt-2">
              No contacts
            </Typography.Body>
          )}
        </Card.Primary>
        <Card.Primary
          className="min-h-[400px]"
          title="Data Imported"
          text="Pubky successfully imported your profile and contacts."
        ></Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-3.png" />
      </div>
      <div className="w-full max-w-[1200px] mt-6 justify-between items-center inline-flex">
        <Link href="/onboarding/permissions">
          <Button.Large
            icon={<Icon.ArrowLeft />}
            className="w-[140px]"
            variant="secondary"
          >
            Back
          </Button.Large>
        </Link>
        <Link href="/home">
          <Button.Large icon={<Icon.Check />} className="w-[140px] z-20">
            Finish
          </Button.Large>
        </Link>
      </div>
    </Onboarding.Layout>
  );
}
