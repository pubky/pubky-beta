'use client';

import { useEffect, useState } from 'react';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header } from '../../../components';
import { Contacts } from '../components';
import { useClientContext } from '../../../contexts/client';
import { useFilterContext } from '../../../contexts/filters';
import {
  IFollowingResponse,
  IFollowersResponse,
  IFriendsResponse,
  TContacts,
} from '../../../types';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const creatorPubky = params.creatorPubky;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { listFollowing, listFollowers, getUserIndexed } = useClientContext();
  const { contacts, contactsLayout, setContacts } = useFilterContext();
  const [name, setName] = useState('Loading...');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [userExist, setUserExist] = useState(true);
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
        setLoading(true);
        if (!creatorPubky) return;

        const contactsFollowers = await listFollowers(creatorPubky);
        const contactsFollowing = await listFollowing(creatorPubky);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfile = await getUserIndexed(creatorPubky);

        if (userProfile && userProfile.profile) {
          setName(userProfile?.profile.name || '');
          setImage(userProfile.profile.image || '/images/Userpic.png');
          setLoading(false);
        } else {
          setUserExist(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const searchUrl = contacts
      ? `/contacts/${creatorPubky}?tab=${contacts}`
      : '/contacts';
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
      <Header className="hidden md:block" />
      <Content.Grid>
        {userExist ? (
          <>
            <Contacts.Me
              image={image}
              name={name}
              pubkey={creatorPubky ? creatorPubky.toString() : ''}
              countContacts={countContacts}
              loadingContacts={loadingContacts}
            />
            <div className="mb-6">
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
                onClick={() => setContacts('following')}
                active={!loadingContacts && contacts === 'following'}
                icon={<Icon.UsersRight />}
                className="mr-0.5"
              >
                Following{' '}
                {!loadingContacts && `(${countContacts.following.toString()})`}
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
          </>
        ) : (
          <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
            <Typography.Body
              variant="small"
              className="text-opacity-50 text-center"
            >
              This contacts profile was not found or has been deleted by its
              author.
              <Link
                href="/home"
                className="ml-2 text-fuchsia-500 text-opacity-80 hover:text-opacity-100 cursor-pointer"
              >
                Go home
              </Link>
            </Typography.Body>
          </div>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
