'use client';

import { useEffect, useState } from 'react';
import { Content, Icon, Typography } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Following } from './components';
import { useClientContext } from '../../contexts/client';
import { IFollowingResponse } from '../../types';

export default function Index() {
  const { pubky, getProfile, listFollowing } = useClientContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<IFollowingResponse | null>(null);

  async function fetchFollowing() {
    try {
      setLoading(true);
      if (!pubky) return;

      const following = await listFollowing(pubky);
      setFollowing(following);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProfile() {
    try {
      const userProfile = await getProfile();

      if (userProfile) {
        setName(userProfile.name || '');
        setImage(userProfile.image || '/images/Userpic.png');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header
        className="hidden w-[400px] xl:w-[260px] md:block"
        title="Following"
      />
      {loading ? (
        <div>
          <div className={`flex w-full justify-center mt-10`}>
            <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
          </div>
          <Typography.Body
            variant="medium-bold"
            className="col-span-3 m-2 flex justify-center items-center gap-6 text-opacity-20"
          >
            Loading Following
          </Typography.Body>
        </div>
      ) : (
        <>
          <Following.Me
            image={image}
            name={name}
            pubkey={pubky ? pubky.toString() : ''}
            followingCount={following?.count}
          />
          <Content.Grid>
            <Following.Root>
              <Following.FollowingUsers following={following?.following} />
            </Following.Root>
          </Content.Grid>
        </>
      )}
      <CreatePost />
    </Content.Main>
  );
}
