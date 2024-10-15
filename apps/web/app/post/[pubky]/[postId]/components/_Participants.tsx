import { Icon, Button, SideCard } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';
import { PostThread, PostView } from '@/types/Post';
import { UseUserFollowing, useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';

export default function Participants({
  repliesResponse,
  author,
}: {
  repliesResponse: PostThread | undefined;
  author: string;
}) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { data: followingUsers } = UseUserFollowing(pubky ?? '');
  //const { follow, unfollow, listFollowing } = useClientContext();
  const { data: authorData } = useUserProfile(author, pubky ?? '');
  const [replies, setReplies] = useState<PostView[]>([]);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [participants, setParticipants] = useState<UserView[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  const fetchReplies = async () => {
    try {
      if (repliesResponse) {
        setReplies(repliesResponse?.replies || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repliesResponse]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky || !replies) return;

        const following = followingUsers;

        if (following) {
          const followingIds = following.map((user) =>
            user.replace('pubky:', '')
          );
          const matchedFollowedIds = replies.filter((reply) =>
            followingIds.includes(reply?.details?.author)
          );

          if (matchedFollowedIds.length > 0) {
            setInitLoadingFollowers(false);
            matchedFollowedIds.forEach((followed) => {
              setFollowedUser((prevState) => ({
                ...prevState,
                [followed.details.author]: true,
              }));
            });
          } else {
            setInitLoadingFollowers(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowing();
  }, [pubky, replies, followingUsers]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false,
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
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getAuthorButton = () => {
    const authorId = authorData ? authorData.details.id : '';
    const followed =
      followedUser[authorId] || authorData?.relationship?.following || false;
    if (pubky === authorId) {
      return (
        <Button.Medium
          className="w-[114px] bg-transparent cursor-default"
          icon={<Icon.Check />}
        >
          Me
        </Button.Medium>
      );
    } else if (initLoadingFollowers) {
      return (
        <Button.Medium
          disabled
          icon={<Icon.LoadingSpin size="16" />}
          className="w-[114px]"
        >
          Loading
        </Button.Medium>
      );
    } else if (followed) {
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
        <Button.Medium
          className="w-[114px] bg-transparent cursor-default"
          icon={<Icon.Check />}
        >
          Me
        </Button.Medium>
      );
    } else if (initLoadingFollowers) {
      return (
        <Button.Medium
          disabled
          icon={<Icon.LoadingSpin size="16" />}
          className="w-[114px]"
        >
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

  const fetchParticipants = async () => {
    if (!replies) return;

    const uniqueAuthors = [
      ...new Set(replies.map((reply) => reply.details.author)),
    ];
    const profiles = await Promise.all(
      uniqueAuthors.map((authorId) => getUserProfile(authorId, pubky ?? ''))
    );
    setParticipants(profiles);
  };

  useEffect(() => {
    fetchParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies]);

  return (
    <div className="hidden flex-col gap-6 xl:inline-flex col-span-1 self-start sticky top-[120px]">
      <div>
        <SideCard.Header title="Participants" />
        <SideCard.Content>
          <SideCard.User
            uri={authorData ? authorData.details.id : ''}
            uriImage={authorData?.details?.image || '/images/Userpic.png'}
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
                    uriImage={
                      participant?.details?.image || '/images/Userpic.png'
                    }
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
