'use client';

import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, Skeleton } from '../../components';
import { Following } from './../components';
import { useClientContext } from '../../../contexts/client';
import { IFollowingResponse } from '../../../types';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const creatorPubky = params.creatorPubky;

  const { pubky, getUserIndexed, listFollowing } = useClientContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [following, setFollowing] = useState<IFollowingResponse | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfile = await getUserIndexed(creatorPubky);

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
  }, [creatorPubky, getUserIndexed]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!creatorPubky) return;

        const following = await listFollowing(creatorPubky);

        setFollowing(following);
        setLoadingFollowing(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [creatorPubky, listFollowing]);

  return (
    <Content.Main>
      <Header
        className="hidden w-[400px] xl:w-[260px] md:block"
        title="Following"
      />
      {loading ? (
        <Skeleton.FollowerMe />
      ) : (
        <Following.Me
          image={image}
          name={name}
          pubkey={pubky === creatorPubky ? '' : creatorPubky}
          followingCount={following?.count}
        />
      )}
      <Content.Grid>
        <Following.Root>
          {loadingFollowing ? (
            <Skeleton.Followers />
          ) : (
            <Following.FollowingUsers following={following?.following} />
          )}
        </Following.Root>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
