'use client';

import { useEffect, useState } from 'react';
import { Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header } from '../../components';
import { Followers } from './../components';
import { useClientContext } from '../../../contexts/client';
import { IFollowersResponse } from '../../../types';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const creatorPubky = params.creatorPubky;

  const { pubky, getUserIndexed, listFollowers } = useClientContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<IFollowersResponse | null>(null);

  async function fetchFollowers() {
    try {
      if (!creatorPubky) return;

      const followers = await listFollowers(creatorPubky);

      setFollowers(followers);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProfile() {
    try {
      const userProfile = await getUserIndexed(creatorPubky);

      if (userProfile) {
        setName(userProfile.profile?.name || '');
        setImage(userProfile.profile?.image || '/images/Userpic.png');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header
        className="hidden w-[400px] xl:w-[260px] md:block"
        title="Followers"
      />
      {loading ? (
        <div>
          <div className={`flex w-full justify-center mt-10`}>
            <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
          </div>
          <Typography.Body
            variant="medium-bold"
            className="col-span-3 m-2 flex justify-center items-center gap-6 text-gray-600"
          >
            Loading Followers
          </Typography.Body>
        </div>
      ) : (
        <>
          <Followers.Me
            image={image}
            name={name}
            pubkey={pubky === creatorPubky ? '' : creatorPubky}
            followersCount={followers?.count}
          />
          <Content.Grid>
            <Followers.Root>
              <Followers.Follower followers={followers?.followers} />
            </Followers.Root>
          </Content.Grid>
        </>
      )}
      <CreatePost />
    </Content.Main>
  );
}
