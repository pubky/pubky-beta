'use client';

import { useEffect, useState } from 'react';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Contacts } from './components';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import {
  IFollowingResponse,
  IFollowersResponse,
  IFriendsResponse,
} from '../../types';

export default function Index() {
  const { pubky, listFollowing, listFollowers, getProfile } =
    useClientContext();
  const { contacts, contactsLayout, setContacts } = useFilterContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [countContacts, setCountContacts] = useState(0);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsUsers, setContactsUsers] = useState<
    IFollowingResponse | IFollowersResponse | IFriendsResponse | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (!pubky) return;

        let contactsList:
          | IFollowersResponse
          | IFollowingResponse
          | IFriendsResponse
          | null = null;

        if (contacts === 'following') {
          contactsList = await listFollowing(pubky);
          if (contactsList) setCountContacts(contactsList.count);
        } else if (contacts === 'followers') {
          contactsList = await listFollowers(pubky);
          if (contactsList) setCountContacts(contactsList.count);
        } else if (contacts === 'friends') {
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

          contactsList = {
            count: mutualContacts.length,
            friends: mutualContacts,
          };
          if (contactsList) setCountContacts(contactsList.count);
        }

        if (contactsList) {
          setContactsUsers(contactsList);
        }
        setLoadingContacts(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

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
      {loadingContacts || loading ? (
        <div className="mt-12">
          <div className="flex w-full justify-center">
            <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
          </div>
          <Typography.Body
            variant="medium-bold"
            className="col-span-3 m-2 flex justify-center items-center gap-6 text-opacity-20"
          >
            Loading Contacts
          </Typography.Body>
        </div>
      ) : (
        <Content.Grid>
          <Contacts.Me
            image={image}
            name={name}
            pubkey={pubky ? pubky.toString() : ''}
            countContacts={countContacts}
            contactsLayout={contacts}
          />
          <div className="mb-6">
            <Button.Tab
              onClick={() => setContacts('followers')}
              active={contacts === 'followers'}
              icon={<Icon.UsersLeft />}
              className="mr-0.5"
            >
              Followers
            </Button.Tab>
            <Button.Tab
              onClick={() => setContacts('following')}
              active={contacts === 'following'}
              icon={<Icon.UsersRight />}
              className="mr-0.5"
            >
              Following
            </Button.Tab>
            <Button.Tab
              onClick={() => setContacts('friends')}
              active={contacts === 'friends'}
              icon={<Icon.Smiley />}
            >
              Friends
            </Button.Tab>
          </div>
          {contactsUsers?.count ?? 0 > 0 ? (
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
      )}
      <CreatePost />
    </Content.Main>
  );
}
