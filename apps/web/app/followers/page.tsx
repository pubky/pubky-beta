'use client';

import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, Skeleton } from '../components';
import { Followers } from './components';
import { useClientContext } from '../../contexts/client';
import { IFollowersResponse } from '../../types';

export default function Index() {
  const { pubky, getProfile, listFollowers } = useClientContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followers, setFollowers] = useState<IFollowersResponse | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfile = await getProfile();

        if (userProfile) {
          setName(userProfile.profile?.name || '');
          setImage(userProfile.profile?.image || '/images/Userpic.png');
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
        title="Followers"
      />
      {loading ? (
        <Skeleton.FollowerMe />
      ) : (
        <Followers.Me
          image={image}
          name={name}
          pubkey={pubky ? pubky.toString() : ''}
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
