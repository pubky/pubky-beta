import { Content, Icon, Button, Typography, SideCard } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { IReply } from '../../../../../types';
import { Post, Skeleton } from '../../../../../components';
import { Utils } from '../../../../../utils';

export default function Replies({
  repliesResponse,
}: {
  repliesResponse: IReply;
}) {
  const { pubky, follow, unfollow, listFollowing } = useClientContext();
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [replies, setReplies] = useState<IReply[]>([]);
  const [repliesCount, setRepliesCount] = useState<number | undefined>();
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const seenAuthors = new Set<string>();

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      if (repliesResponse) {
        setRepliesCount(repliesResponse?.post?.repliesCount);
        setReplies(repliesResponse?.replies || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingReplies(false);
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

  const renderReplies = (replies: IReply[], depth: number = 0) => {
    return replies.map((reply) => {
      return (
        <div key={reply.post.id}>
          <Post
            post={reply.post}
            size="full"
            fullContent
            className={depth > 0 || reply.replies.length > 0 ? 'border-0' : ''}
            line={reply.replies.length > 0}
          />
          {reply.replies && reply.replies.length > 0 && (
            <div className="ml-[47px]">
              {renderReplies(reply.replies, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {loadingReplies ? (
        <Skeleton.Simple />
      ) : repliesCount === 0 || (replies && replies.length === 0) ? (
        <Typography.Body className="text-opacity-50 text-center">
          No replies yet
        </Typography.Body>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex-col gap-6 inline-flex col-span-2">
            <Typography.H2>Replies</Typography.H2>
            {renderReplies(replies)}
          </div>
          <div className="hidden flex-col gap-6 xl:inline-flex col-span-1 self-start sticky top-[160px]">
            <div>
              <SideCard.Header title="Participants" />
              <SideCard.Content>
                {replies.map((reply, index) => {
                  if (reply.post && !seenAuthors.has(reply.post.author.id)) {
                    seenAuthors.add(reply.post.author.id);
                    const pubkeyUser =
                      pubky && reply.post.author.id.includes(pubky);
                    const isFollowed =
                      followedUser[reply.post.author.id] || false;

                    return (
                      <React.Fragment key={reply.post.author.id}>
                        <SideCard.User
                          uri={reply.post.author.uri}
                          src={
                            reply.post.author.profile?.image ||
                            '/images/Userpic.png'
                          }
                          username={Utils.minifyText(
                            reply.post.author.profile?.name
                          )}
                          label={Utils.minifyPubky(reply.post.author.id)}
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
                        {index !== replies.length - 1 && (
                          <Content.Divider className="my-2.5" />
                        )}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </SideCard.Content>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
