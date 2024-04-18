'use client';

import { useEffect, useState } from 'react';
import { Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header, Skeleton } from '../components';
import { Contacts } from './components';
import { DropDown } from '../components/DropDown';
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
  const { contacts, contactsLayout } = useFilterContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<IFollowersResponse | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsUsers, setContactsUsers] = useState<
    IFollowingResponse | IFollowersResponse | IFriendsResponse | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;

        let contactsList:
          | IFollowersResponse
          | IFollowingResponse
          | IFriendsResponse
          | null = null;

        if (contacts === 'following') {
          contactsList = await listFollowing(pubky);
        } else if (contacts === 'followers') {
          contactsList = await listFollowers(pubky);
        } else {
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
            contacts: mutualContacts,
          };
        }

        if (contactsList) {
          setContactsUsers(contactsList);
        }
        setLoadingContacts(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, contacts, listFollowing, listFollowers]);

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
  }, [pubky, getProfile]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;

        const followers = await listFollowers(pubky);
        setFollowers(followers);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowers]);

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
    } else {
      contactsToShow = contactsUsers.contacts || [];
    }
  }
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Contacts">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Contacts />
          <DropDown.SortFriends />
          <DropDown.ContactsLayout />
        </div>
      </Header>
      <Content.Grid>
        {contactsLayout === 'list' &&
          (loading ? (
            <Skeleton.FollowerMe />
          ) : (
            <Contacts.Me
              image={image}
              name={name}
              pubkey={pubky ? pubky.toString() : ''}
              followersCount={followers?.count}
            />
          ))}
        {loadingContacts ? (
          <div className="flex justify-center items-center">
            <Icon.LoadingSpin />
          </div>
        ) : contactsUsers?.count ?? 0 > 0 ? (
          <Contacts.Contact contacts={contactsToShow} />
        ) : (
          <Typography.H2 className="font-normal text-opacity-30 text-center">
            No contacts yet
          </Typography.H2>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
