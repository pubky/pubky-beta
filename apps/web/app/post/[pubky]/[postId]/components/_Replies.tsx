import { Content, Icon, Button, Typography, SideCard } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../../../../contexts/client';
import { IPost, IReply } from '../../../../../types';
import { Post, Skeleton } from '../../../../../components';
import { Utils } from '../../../../../utils';

export default function Replies({ uri }: { uri: string }) {
  const { pubky, getPost, getReplies, follow, unfollow, listFollowing } =
    useClientContext();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [loadingReplies, setLoadingReplies] = useState(true);
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
    setLoadingReplies(true);
    try {
      const repliesResponse = await getReplies(post.uri);

      if (repliesResponse) {
        setReplies(repliesResponse?.replies);
        setLoadingReplies(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!uri) return;
      const result = await getPost(uri);

      if (result) {
        setPost(result);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, getPost]);

  useEffect(() => {
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

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
            followingIds.includes(reply.post.author.id)
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
    <>
      {!loadingReplies && replies.length === 0 ? (
        <Typography.Body className="text-opacity-50 text-center">
          No replies yet
        </Typography.Body>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex-col gap-6 inline-flex col-span-2">
            <Typography.H2>Replies</Typography.H2>
            {loadingReplies ? (
              <Skeleton.Simple />
            ) : (
              replies.map((reply) => (
                <Post
                  key={reply.post.id}
                  post={reply.post}
                  size="full"
                  fullContent
                />
              ))
            )}
            {/** {/**<div key={reply.id} className="flex items-center">
            <div className="border-l-2 h-full border-white border-opacity-10" />
        <div className="w-6 h-px bg-white bg-opacity-20" />
            {/* <div className="flex items-center">
        <div className="border-l-2 h-full border-white border-opacity-10" />
        <div className="border-l-2 h-full ml-6 border-white border-opacity-10" />
        <div className="w-6 h-px bg-white bg-opacity-20" />
        <Post />
      </div> */}
          </div>
          <div className="hidden flex-col gap-6 xl:inline-flex col-span-1 self-start sticky top-[160px]">
            <div>
              <SideCard.Header title="Participants" />
              <SideCard.Content>
                {loadingReplies ? (
                  <Skeleton.Simple />
                ) : (
                  replies.map((reply, index) => {
                    if (!seenAuthors.has(reply.post.author.id)) {
                      seenAuthors.add(reply.post.author.id);
                      const pubkeyUser =
                        pubky && reply.post.author.id.includes(pubky);
                      const isFollowed =
                        followedUser[reply.post.author.id] || false;

                      return (
                        <>
                          <SideCard.User
                            key={reply.post.author.id}
                            uri={reply.post.author.uri}
                            src={
                              reply.post.author.profile.image ||
                              '/images/Userpic.png'
                            }
                            username={Utils.minifyText(
                              reply.post.author.profile.name
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
                                onClick={
                                  loadingFollowers[reply.post.author.id]
                                    ? undefined
                                    : () => unfollowUser(reply.post.author.id)
                                }
                                disabled={
                                  loadingFollowers[reply.post.author.id]
                                }
                                loading={loadingFollowers[reply.post.author.id]}
                                icon={<Icon.UserMinus size="16" />}
                                className="w-[114px]"
                              >
                                Unfollow
                              </Button.Medium>
                            ) : (
                              <Button.Medium
                                onClick={
                                  loadingFollowers[reply.post.author.id]
                                    ? undefined
                                    : () => followUser(reply.post.author.id)
                                }
                                disabled={
                                  loadingFollowers[reply.post.author.id]
                                }
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
                        </>
                      );
                    }
                    return null;
                  })
                )}
              </SideCard.Content>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
