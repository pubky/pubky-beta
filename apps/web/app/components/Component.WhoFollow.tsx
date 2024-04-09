/* eslint-disable @typescript-eslint/no-explicit-any */

import { Content, Icon, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import { minifyText } from '../../libs/textHelper';
import { Skeleton } from '.';
import { Followed } from '../../types';

export default function WhoFollow() {
  const { pubky, getMostFollowed, follow, unfollow, listFollowing } =
    useClientContext();
  const [hotFollowed, setHotFollowed] = useState<Followed[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  useEffect(() => {
    async function fetchFollowed() {
      try {
        const result = await getMostFollowed();

        if (result) {
          setHotFollowed(result);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowed();
  }, [getMostFollowed]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky) return;

        const following = await listFollowing(pubky);

        if (following) {
          following.following.forEach((user: any) => {
            const uri = user.uri.replace('pubky:', '');
            if (hotFollowed.some((followed: any) => followed.id === uri)) {
              setFollowedUser((prevState) => ({
                ...prevState,
                [uri]: true,
              }));
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowing();
  }, [pubky, listFollowing, hotFollowed]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      const result = await follow(pubkyFollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      const result = await unfollow(pubkyUnfollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <SideCard.Header title="Who to follow" />
      <SideCard.Content>
        {loading ? (
          <Skeleton.WhoFollow />
        ) : hotFollowed.length > 0 ? (
          hotFollowed.slice(0, 3).map((followed, index) => {
            const pubkeyUser = pubky && followed.id.includes(pubky);
            const isFollowed = followedUser[followed.id] || false;

            return (
              <div key={index + 1}>
                <SideCard.User
                  uri={followed.id}
                  src={followed?.profile?.image}
                  username={minifyText(followed?.profile?.name)}
                  label={minifyPubky(followed.id)}
                >
                  {pubkeyUser ? (
                    <SideCard.FollowAction
                      text="Me"
                      icon={<Icon.Check />}
                      className="bg-transparent cursor-default"
                    />
                  ) : isFollowed ? (
                    <SideCard.FollowAction
                      onClick={() => unfollowUser(followed.id)}
                      text="Unfollow"
                      icon={<Icon.UserMinus size="16" />}
                    />
                  ) : (
                    <SideCard.FollowAction
                      onClick={() => followUser(followed.id)}
                    />
                  )}
                </SideCard.User>
                {index !== hotFollowed.length - 1 && <Content.Divider />}
              </div>
            );
          })
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No users yet
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
