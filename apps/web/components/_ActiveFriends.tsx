'use client';

// import { useRouter } from 'next/navigation';
import { Content, Icon, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../contexts/client';
import { Utils } from '../utils';
import { IFriendsResponse } from '../types';

export default function ActiveFriends() {
  // const router = useRouter();
  const { pubky, listFollowers, listFollowing } = useClientContext();
  const [friends, setFriends] = useState<IFriendsResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

        setFriends(contactsFriends);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  return (
    <div className="my-6">
      <SideCard.Header title="Active Friends" />
      <SideCard.Content>
        {loading ? (
          <>
            <div className="flex w-full justify-center">
              <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
            </div>
            <Typography.Body
              variant="medium-bold"
              className="col-span-3 mt-2 flex justify-center items-center gap-6 text-opacity-20"
            >
              Loading Active Friends
            </Typography.Body>
          </>
        ) : friends && friends.friends.length > 0 ? (
          <>
            {friends.friends.slice(0, 3).map((friend, index: number) => {
              return (
                <div key={index}>
                  <SideCard.User
                    uri={friend.uri.replace('pubky:', '')}
                    src={friend?.profile?.image || '/images/Userpic.png'}
                    username={
                      friend?.profile?.name &&
                      Utils.minifyText(friend?.profile?.name, 8)
                    }
                    label={Utils.minifyPubky(friend.uri.replace('pubky:', ''))}
                  />
                  {index !== friends.friends.length - 1 && (
                    <Content.Divider className="my-2" />
                  )}
                </div>
              );
            })}
            {/** <SideCard.Action
              onClick={() => router.push('/active-friends')}
              icon={<Icon.UsersLeft size="20" />}
              text="See all"
          />*/}
          </>
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No friends to show
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
