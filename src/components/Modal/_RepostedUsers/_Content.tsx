'use client';

import { useState, useEffect } from 'react';
import { Typography, SideCard, Icon } from '@social/ui-shared';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext, useAlertContext } from '@/contexts';
import { Utils } from '@/components/utils-shared';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';

interface RepostedUsersProps {
  users: string[];
}

export default function ContentRepostedUsers({ users }: RepostedUsersProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [followedUser, setFollowedUser] = useState<Record<string, boolean>>({});
  const [loadingFollowers, setLoadingFollowers] = useState<Record<string, boolean>>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>({});
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);

  // Fetch user profiles and determine initial follow state
  useEffect(() => {
    if (users.length === 0) return;

    const fetchProfiles = async () => {
      setInitLoadingFollowers(true);
      const profilesMap: { [key: string]: UserView } = {};
      const followedMap: { [key: string]: boolean } = {};

      await Promise.all(
        users.map(async (userId) => {
          if (userProfiles[userId]) return;
          try {
            const profile = await getUserProfile(userId, pubky ?? '');
            profilesMap[userId] = profile;
            followedMap[userId] = profile.relationship?.following ?? false;
          } catch (error) {
            console.error(`Error fetching profile for user ${userId}`, error);
          }
        })
      );

      setUserProfiles((prev) => ({ ...prev, ...profilesMap }));
      setFollowedUser((prev) => ({ ...prev, ...followedMap }));
      setInitLoadingFollowers(false);
    };

    fetchProfiles();
  }, [users, pubky]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prev) => ({ ...prev, [pubkyFollow]: true }));
      const result = await follow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prev) => ({ ...prev, [pubkyFollow]: result }));
      setLoadingFollowers((prev) => ({ ...prev, [pubkyFollow]: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      setLoadingFollowers((prev) => ({ ...prev, [pubkyUnfollow]: true }));
      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prev) => ({ ...prev, [pubkyUnfollow]: !result }));
      setLoadingFollowers((prev) => ({ ...prev, [pubkyUnfollow]: false }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 max-h-[300px] pr-4 overflow-y-auto scrollbar-thin scrollbar-webkit">
      {users.map((user, userIndex) => {
        const profile = userProfiles[user];
        const pubkeyUser = pubky && user.includes(pubky);
        const isFollowed = followedUser[user];

        return (
          <div key={userIndex} className="w-full flex justify-between gap-10">
            <SideCard.User
              uri={profile?.details?.id.replace('pubky:', '')}
              username={profile?.details?.name && Utils.minifyText(profile?.details?.name)}
              label={Utils.minifyPubky(profile?.details?.id.replace('pubky:', ''))}
            />
            {pubkeyUser ? (
              <SideCard.FollowAction
                text="Me"
                icon={<Icon.User size="16" />}
                className="bg-transparent cursor-default"
              />
            ) : initLoadingFollowers ? (
              <SideCard.FollowAction disabled icon={<Icon.LoadingSpin size="16" />} variant="small" />
            ) : isFollowed ? (
              <SideCard.FollowAction
                onClick={loadingFollowers[user] ? undefined : () => unfollowUser(user)}
                disabled={loadingFollowers[user]}
                loading={loadingFollowers[user]}
                icon={<Icon.Minus size="16" />}
                variant="small"
              />
            ) : (
              <SideCard.FollowAction
                onClick={loadingFollowers[user] ? undefined : () => followUser(user)}
                disabled={loadingFollowers[user]}
                loading={loadingFollowers[user]}
                icon={<Icon.Plus size="16" />}
                variant="small"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
