/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Content,
  Typography,
  Card,
  Button,
  Icon,
  List,
} from '@social/ui-shared';
import { Onboarding } from '../components';
import { useClientContext } from '../../../contexts/client';
import { minifyPubky } from '../../../libs/pubkyHelper';
import { minifyText } from '../../../libs/textHelper';
import { Skeleton } from '../../components';

export default function Index() {
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
    setHandler(minifyPubky(pubky));
  }, [pubky]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;

        const followers = await listFollowers(pubky);

        if (followers) {
          setContacts(
            followers.followers.map((user: any, index: any) => ({
              alt: 'contact-pic-' + (index + 1),
              src: user.profile.image,
              name: user.profile.name,
              handler: minifyPubky(user.uri.replace('pubky:', '')),
            }))
          );
          setLoadingContacts(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowers]);

  useEffect(() => {
    async function fetchData() {
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
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, getProfile]);

  const profile = {
    name: minifyText(name),
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
            minifyText(name)
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
            <Skeleton.ContactsList />
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
          title="Ready to Go!"
          text="Pubky successfully imported your profile and contacts."
        >
          <Link href="/home" className="mt-4 lg:mt-0">
            <Button.Large icon={<Icon.Check />}>Finish</Button.Large>
          </Link>
        </Card.Primary>
        <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-3.png" />
      </div>
    </Onboarding.Layout>
  );
}
