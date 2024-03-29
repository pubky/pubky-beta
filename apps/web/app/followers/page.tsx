'use client';

import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, Skeleton } from '../components';
import { Followers } from './components';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';

interface Followers {
  count: number;
  followers: [];
}

export default function Index() {
  const { pubky, getProfile, listFollowers } = useClientContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followers, setFollowers] = useState<Followers | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile();
        if (profile) {
          setName(profile?.name || '');
          setImage(profile?.image || '/images/Userpic.png');
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
        setLoadingFollowers(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowers]);

  return (
    <Content.Main>
      <Header
        className="hidden w-[400px] xl:w-[260px] md:block"
        title={
          loading ? (
            <Skeleton.DisplayText className="h-8 w-22" />
          ) : (
            `${name}'s\u00A0Followers`
          )
        }
      />
      {loading ? (
        <Skeleton.FollowerMe />
      ) : (
        <Followers.Me
          image={image}
          name={name}
          pubkey={minifyPubky(pubky)}
          followersCount={followers?.count}
        />
      )}
      <Content.Grid>
        <Followers.Root>
          {loadingFollowers ? (
            <Skeleton.Followers />
          ) : (
            <Followers.Follower followers={followers?.followers} />
          )}
        </Followers.Root>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
