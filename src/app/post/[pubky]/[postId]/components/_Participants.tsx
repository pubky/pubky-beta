'use client';

import { Icon, Button, SideCard } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';
import { useUserProfile } from '@/hooks/useUser';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';

export default function Participants({ author }: { author: string }) {
  const { pubky, follow, unfollow, replies, mutedUsers } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { data: authorData } = useUserProfile(author, pubky ?? '');
  const [initLoadingAuthor, setInitLoadingAuthor] = useState(true);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [participants, setParticipants] = useState<UserView[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  useEffect(() => {
    setInitLoadingAuthor(true);
    if (authorData) {
      setFollowedUser((prevState) => ({
        ...prevState,
        [authorData.details.id]: authorData.relationship?.following || false
      }));
    }
    setInitLoadingAuthor(false);
  }, [authorData]);

  const fetchParticipants = async () => {
    if (!Array.isArray(replies) || replies.length === 0) return;

    try {
      const uniqueAuthors = [...new Set(replies.map((reply) => reply.details.author))];

      // Check if we have any new authors that aren't in our current participants list
      const currentParticipantIds = new Set(participants.map((p) => p.details.id));
      const hasNewParticipants = uniqueAuthors.some((authorId) => !currentParticipantIds.has(authorId));

      if (!hasNewParticipants) return;

      setInitLoadingFollowers(true);

      const profiles = await Promise.all(uniqueAuthors.map((authorId) => getUserProfile(authorId, pubky ?? '')));

      const filteredProfiles = profiles.filter((profile) => !mutedUsers?.includes(profile.details.id));

      const followedMap = filteredProfiles.reduce(
        (acc, profile) => {
          if (profile.relationship?.following) {
            acc[profile.details.id] = true;
          }
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      setParticipants(filteredProfiles);
      setFollowedUser((prevState) => ({ ...prevState, ...followedMap }));
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setInitLoadingFollowers(false);
    }
  };
  useEffect(() => {
    fetchParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true
      }));

      const result = await follow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true
      }));

      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getAuthorButton = () => {
    const authorId = authorData ? authorData.details.id : '';
    const isFollowed = followedUser[authorId];
    if (pubky === authorId) {
      return (
        <Button.Medium className="w-[114px] bg-transparent cursor-default" icon={<Icon.User size="16" />}>
          Me
        </Button.Medium>
      );
    } else if (initLoadingAuthor) {
      return (
        <Button.Medium disabled icon={<Icon.LoadingSpin size="16" />} className="w-[114px]">
          Loading
        </Button.Medium>
      );
    } else if (isFollowed) {
      return (
        <Button.Medium
          onClick={() => unfollowUser(authorId)}
          disabled={loadingFollowers[authorId]}
          loading={loadingFollowers[authorId]}
          icon={<Icon.UserMinus size="16" />}
          className="w-[114px]"
        >
          Unfollow
        </Button.Medium>
      );
    } else {
      return (
        <Button.Medium
          onClick={() => followUser(authorId)}
          disabled={loadingFollowers[authorId]}
          loading={loadingFollowers[authorId]}
          icon={<Icon.UserPlus size="16" />}
          className="w-[114px]"
        >
          Follow
        </Button.Medium>
      );
    }
  };

  const getParticipantButton = (authorId: string) => {
    if (pubky === authorId) {
      return (
        <Button.Medium className="w-[114px] bg-transparent cursor-default" icon={<Icon.User size="16" />}>
          Me
        </Button.Medium>
      );
    } else if (initLoadingFollowers) {
      return (
        <Button.Medium disabled icon={<Icon.LoadingSpin size="16" />} className="w-[114px]">
          Loading
        </Button.Medium>
      );
    } else if (followedUser[authorId]) {
      return (
        <Button.Medium
          onClick={() => unfollowUser(authorId)}
          disabled={loadingFollowers[authorId]}
          loading={loadingFollowers[authorId]}
          icon={<Icon.UserMinus size="16" />}
          className="w-[114px]"
        >
          Unfollow
        </Button.Medium>
      );
    } else {
      return (
        <Button.Medium
          onClick={() => followUser(authorId)}
          disabled={loadingFollowers[authorId]}
          loading={loadingFollowers[authorId]}
          icon={<Icon.UserPlus size="16" />}
          className="w-[114px]"
        >
          Follow
        </Button.Medium>
      );
    }
  };

  return (
    <div className="hidden flex-col gap-6 xl:inline-flex col-span-1 self-start sticky top-[120px]">
      <div>
        <SideCard.Header title="Participants" />
        <SideCard.Content>
          <SideCard.User
            uri={authorData ? authorData.details.id : ''}
            username={Utils.minifyText(authorData?.details?.name ?? '')}
            label={Utils.minifyPubky(authorData?.details?.id ?? '')}
            className="mb-2"
          >
            {getAuthorButton()}
          </SideCard.User>
          {participants.map((participant: UserView) => {
            if (participant.details.id !== authorData?.details.id) {
              return (
                <React.Fragment key={participant.details.id}>
                  <SideCard.User
                    uri={participant.details.id}
                    username={Utils.minifyText(participant?.details?.name)}
                    label={Utils.minifyPubky(participant.details.id)}
                    className="mb-2"
                  >
                    {getParticipantButton(participant.details.id)}
                  </SideCard.User>
                </React.Fragment>
              );
            }
            return null;
          })}
        </SideCard.Content>
      </div>
    </div>
  );
}
