'use client';

import { useEffect, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, Skeleton } from '../components';
import { Contacts } from './components';
import { DropDown } from '../components/DropDown';
import { useClientContext } from '../../contexts/client';

interface Contacts {
  count: number;
  followers: [];
}

export default function Index() {
  const { pubky, listFollowers } = useClientContext();
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contacts, setContacts] = useState<Contacts | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;

        const contacts = await listFollowers(pubky);
        setContacts(contacts);
        setLoadingContacts(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowers]);

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
        {loadingContacts ? (
          <Skeleton.Contacts />
        ) : contacts?.count ?? 0 > 0 ? (
          <Contacts.Contact contacts={contacts?.followers} />
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
