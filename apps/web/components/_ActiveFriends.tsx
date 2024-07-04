'use client';

import { Content, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '@/contexts/client';
import { Utils } from '@social/utils-shared';
import { IFriendsResponse } from '@/types';
import Skeletons from './Skeletons';

export default function ActiveFriends() {
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
          <Skeletons.Simple />
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
