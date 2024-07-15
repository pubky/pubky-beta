import { Icon, Button, SideCard } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { useClientContext } from '@/contexts';
import { IReply } from '@/types';
import { Utils } from '@social/utils-shared';

export default function Partecipants({
  repliesResponse,
}: {
  repliesResponse: IReply;
}) {
  const { pubky, follow, unfollow, listFollowing } = useClientContext();
  const [replies, setReplies] = useState<IReply[]>([]);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const seenAuthors = new Set<string>();

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

        const following = await listFollowing(pubky);

        if (following) {
          const followingIds = following.following.map((user) =>
            user.uri.replace('pubky:', '')
          );
          const matchedFollowedIds = replies.filter((reply) =>
            followingIds.includes(reply?.post?.author?.id)
          );

          if (matchedFollowedIds.length > 0) {
            setInitLoadingFollowers(false);
            matchedFollowedIds.forEach((followed) => {
              setFollowedUser((prevState) => ({
                ...prevState,
                [followed.post.author.id]: true,
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
  }, [pubky, replies, listFollowing]);

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

  return (
    <div className="hidden flex-col gap-6 xl:inline-flex col-span-1 self-start sticky top-[120px]">
      <div>
        <SideCard.Header title="Participants" />
        <SideCard.Content>
          <SideCard.User
            uri={repliesResponse?.post?.author?.id}
            src={
              repliesResponse?.post?.author?.profile?.image ||
              '/images/Userpic.png'
            }
            username={Utils.minifyText(
              repliesResponse?.post?.author?.profile?.name
            )}
            label={Utils.minifyPubky(repliesResponse?.post?.author?.id)}
            className="mb-2"
          >
            {pubky === repliesResponse?.post?.author?.id ? (
              <Button.Medium
                className="w-[114px] bg-transparent cursor-default"
                icon={<Icon.Check />}
              >
                Me
              </Button.Medium>
            ) : initLoadingFollowers ? (
              <Button.Medium
                disabled
                icon={<Icon.LoadingSpin size="16" />}
                className="w-[114px]"
              >
                Loading
              </Button.Medium>
            ) : followedUser[repliesResponse?.post?.author?.id] ? (
              <Button.Medium
                onClick={() => unfollowUser(repliesResponse?.post?.author?.id)}
                disabled={loadingFollowers[repliesResponse?.post?.author?.id]}
                loading={loadingFollowers[repliesResponse?.post?.author?.id]}
                icon={<Icon.UserMinus size="16" />}
                className="w-[114px]"
              >
                Unfollow
              </Button.Medium>
            ) : (
              <Button.Medium
                onClick={() => followUser(repliesResponse?.post?.author?.id)}
                disabled={loadingFollowers[repliesResponse?.post?.author?.id]}
                loading={loadingFollowers[repliesResponse?.post?.author?.id]}
                icon={<Icon.UserPlus size="16" />}
                className="w-[114px]"
              >
                Follow
              </Button.Medium>
            )}
          </SideCard.User>
          {replies.map((reply) => {
            if (
              reply.post &&
              !seenAuthors.has(reply.post.author.id) &&
              reply.post.author.id !== pubky
            ) {
              seenAuthors.add(reply.post.author.id);
              const pubkeyUser = pubky === reply.post.author.id;
              const isFollowed = followedUser[reply.post.author.id] || false;

              return (
                <React.Fragment key={reply.post.author.id}>
                  <SideCard.User
                    uri={reply.post.author.id}
                    src={
                      reply.post.author.profile?.image || '/images/Userpic.png'
                    }
                    username={Utils.minifyText(reply.post.author.profile?.name)}
                    label={Utils.minifyPubky(reply.post.author.id)}
                    className="mb-2"
                  >
                    {pubkeyUser ? (
                      <Button.Medium
                        className="w-[114px] bg-transparent cursor-default"
                        icon={<Icon.Check />}
                      >
                        Me
                      </Button.Medium>
                    ) : initLoadingFollowers ? (
                      <Button.Medium
                        disabled
                        icon={<Icon.LoadingSpin size="16" />}
                        className="w-[114px]"
                      >
                        Loading
                      </Button.Medium>
                    ) : isFollowed ? (
                      <Button.Medium
                        onClick={() => unfollowUser(reply.post.author.id)}
                        disabled={loadingFollowers[reply.post.author.id]}
                        loading={loadingFollowers[reply.post.author.id]}
                        icon={<Icon.UserMinus size="16" />}
                        className="w-[114px]"
                      >
                        Unfollow
                      </Button.Medium>
                    ) : (
                      <Button.Medium
                        onClick={() => followUser(reply.post.author.id)}
                        disabled={loadingFollowers[reply.post.author.id]}
                        loading={loadingFollowers[reply.post.author.id]}
                        icon={<Icon.UserPlus size="16" />}
                        className="w-[114px]"
                      >
                        Follow
                      </Button.Medium>
                    )}
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
