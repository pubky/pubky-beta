'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header } from '@/components';
import Skeletons from '@/components/Skeletons';
import { useClientContext } from '@/contexts/client';
import { useFilterContext } from '@/contexts/filters';
import {
  IFollowingResponse,
  IFollowersResponse,
  IFriendsResponse,
  TContacts,
} from '@/types';
import { Contacts } from './components';

const ContactsContent = () => {
  const { pubky, listFollowing, listFollowers, getProfile } =
    useClientContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { contacts, contactsLayout, setContacts } = useFilterContext();
  const [name, setName] = useState('Loading...');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [countContacts, setCountContacts] = useState({
    followers: 0,
    following: 0,
    friends: 0,
  });
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsUsers, setContactsUsers] = useState<
    IFollowingResponse | IFollowersResponse | IFriendsResponse | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfile = await getProfile();

        if (userProfile) {
          setName(userProfile.name || '');
          setImage(userProfile.image || '/images/Userpic.png');
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (!pubky) return;

        const contactsFollowers = await listFollowers(pubky);
        const contactsFollowing = await listFollowing(pubky);

        const followersIds = new Set(
          contactsFollowers?.followers?.map((follower) =>
            follower.uri.replace('pubky:', '')
          ) || []
        );

        const mutualContacts =
          contactsFollowing?.following?.filter((user) =>
            followersIds.has(user.uri.replace('pubky:', ''))
          ) || [];

        const contactsFriends = {
          count: mutualContacts.length,
          friends: mutualContacts,
        };

        if (contactsFollowers && contactsFollowing && contactsFriends) {
          setCountContacts({
            followers: contactsFollowers.count,
            following: contactsFollowing.count,
            friends: contactsFriends.count,
          });
        }

        if (contacts === 'following') {
          setContactsUsers(contactsFollowing);
        } else if (contacts === 'followers') {
          setContactsUsers(contactsFollowers);
        } else if (contacts === 'friends') {
          setContactsUsers(contactsFriends);
        }

        setLoadingContacts(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    const searchUrl = contacts ? `/contacts?tab=${contacts}` : '/contacts';
    router.replace(searchUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  useEffect(() => {
    const search = searchParams.get('tab');

    if (search) {
      setContacts(search as TContacts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  let contactsToShow:
    | IFollowingResponse['following']
    | IFollowersResponse['followers']
    | IFriendsResponse['friends']
    | [] = [];

  if (!loadingContacts && contactsUsers) {
    if (contacts === 'following' && 'following' in contactsUsers) {
      contactsToShow = contactsUsers.following || [];
    } else if (contacts === 'followers' && 'followers' in contactsUsers) {
      contactsToShow = contactsUsers.followers || [];
    } else if (contacts === 'friends' && 'friends' in contactsUsers) {
      contactsToShow = contactsUsers.friends || [];
    }
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Contacts" />
      <Content.Grid>
        {pubky && !loadingContacts && (
          <Contacts.Me
            image={image}
            name={name}
            pubkey={pubky ? pubky.toString() : ''}
            countContacts={countContacts}
            loadingContacts={loadingContacts}
          />
        )}
        {!loadingContacts && (
          <div className="mb-6">
            <Button.Tab
              onClick={() => setContacts('following')}
              active={!loadingContacts && contacts === 'following'}
              icon={<Icon.UsersRight />}
              className="mr-0.5"
            >
              Following{' '}
              {!loadingContacts && `(${countContacts.following.toString()})`}
            </Button.Tab>
            <Button.Tab
              onClick={() => setContacts('followers')}
              active={!loadingContacts && contacts === 'followers'}
              icon={<Icon.UsersLeft />}
              className="mr-0.5"
            >
              Followers{' '}
              {!loadingContacts && `(${countContacts.followers.toString()})`}
            </Button.Tab>
            <Button.Tab
              onClick={() => setContacts('friends')}
              active={!loadingContacts && contacts === 'friends'}
              icon={<Icon.Smiley />}
            >
              Friends{' '}
              {!loadingContacts && `(${countContacts.friends.toString()})`}
            </Button.Tab>
          </div>
        )}
        {loadingContacts || loading ? (
          <div className="mt-12">
            <Skeletons.Simple />
          </div>
        ) : contactsUsers?.count ?? 0 > 0 ? (
          contactsLayout === 'list' ? (
            <Contacts.Root>
              <Contacts.Contact contacts={contactsToShow} />
            </Contacts.Root>
          ) : (
            <Contacts.Contact contacts={contactsToShow} />
          )
        ) : (
          <Typography.H2 className="font-normal text-opacity-30 text-center">
            No contacts yet
          </Typography.H2>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
};

export default function Index() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactsContent />
    </Suspense>
  );
}
