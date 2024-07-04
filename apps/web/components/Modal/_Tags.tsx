'use client';

import { useEffect, useRef, useState } from 'react';
import { PostUtil, Modal, SideCard, Button, Icon } from '@social/ui-shared';
import { IPost, ITaggedPost } from '../../types';
import { Utils } from '@social/utils-shared';
import { useClientContext } from '../../contexts/client';

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTags: boolean;
  setShowModalTags: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  tag?: ITaggedPost | null;
}

export default function Tags({
  showModalTags,
  setShowModalTags,
  post,
  handleAddTag,
  handleDeleteTag,
  tag,
}: TagsProps) {
  const { pubky, listFollowing, follow, unfollow } = useClientContext();
  const modalTagsRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState<ITaggedPost | null>(
    post?.tags.length ? post.tags[0] : null
  );
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  const handleTagClick = (tag: ITaggedPost) => {
    setSelectedTag(tag);
  };

  useEffect(() => {
    if (tag) {
      setSelectedTag(tag);
    }
  }, [tag]);

  useEffect(() => {
    if (post?.tags?.length === 0) {
      setShowModalTags(false);
    }
  }, [post?.tags, setShowModalTags]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky) return;
        if (!showModalTags) return;

        const following = await listFollowing(pubky);

        if (following) {
          const followingIds = following.following.map((user) =>
            user.uri.replace('pubky:', '')
          );

          const matchedFollowedIds = post.tags
            .flatMap((tag) => tag.from)
            .filter((profile) => followingIds.includes(profile.author.id));

          if (matchedFollowedIds.length > 0) {
            setInitLoadingFollowers(false);
            matchedFollowedIds.forEach((followed) => {
              setFollowedUser((prevState) => ({
                ...prevState,
                [followed.author.id]: true,
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
  }, [pubky, listFollowing, post, showModalTags]);

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

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagsRef.current &&
        !modalTagsRef.current.contains(event.target as Node)
      ) {
        setShowModalTags(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalTagsRef, setShowModalTags]);

  return (
    <Modal.Root
      modalRef={modalTagsRef}
      show={showModalTags}
      closeModal={() => {
        setShowModalTags(false);
      }}
      className="w-[480px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalTags(false);
        }}
      />
      <div className="items-stretch flex-col inline-flex gap-6">
        <Modal.Header title="Tags" />
        <Modal.Content className="block">
          <div className="w-full flex-col gap-8 inline-flex">
            <div className="w-full flex-col gap-2 inline-flex">
              <div className="no-scrollbar mt-2 gap-2 inline-flex overflow-x-auto whitespace-nowrap">
                {post?.tags.map((tag, index) => {
                  const isTagFound = tag.from.some(
                    (fromItem) => fromItem.author.id === pubky
                  );
                  return (
                    <PostUtil.Tag
                      key={index}
                      clicked={selectedTag === tag}
                      color="fuchsia"
                      onClick={() => handleTagClick(tag)}
                      className="flex flex-col pl-9"
                    >
                      <Button.Action
                        variant="custom"
                        size="small"
                        className="absolute -left-9 transform -translate-y-[21px] scale-75"
                        icon={isTagFound ? <Icon.Minus /> : <Icon.Plus />}
                        onClick={(event) => {
                          event.stopPropagation();
                          isTagFound
                            ? handleDeleteTag(tag.tag)
                            : handleAddTag(tag.tag);
                        }}
                      />
                      {Utils.minifyText(tag?.tag.replace(' ', ''), 20)} (
                      {tag?.count})
                    </PostUtil.Tag>
                  );
                })}
              </div>
              {/* {selectedTag && (
                <div
                  onClick={handleTagAction}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  {iconTag}
                  <Typography.Body
                    className="text-opacity-50 hover:text-opacity-80"
                    variant="small"
                  >
                    {buttonTextTag}
                  </Typography.Body>
                </div>
              )} */}
            </div>
            <div className="no-scrollbar flex-col gap-4 inline-flex overflow-y-auto h-44">
              {selectedTag &&
                selectedTag.from.map((user, userIndex) => {
                  const pubkeyUser = pubky && user?.author?.id.includes(pubky);
                  const isFollowed = followedUser[user?.author?.id] || false;

                  return (
                    <div
                      key={userIndex}
                      className="w-full flex justify-between"
                    >
                      <SideCard.User
                        uri={user?.author?.uri.replace('pubky:', '')}
                        src={
                          user?.author?.profile?.image || '/images/Userpic.png'
                        }
                        username={
                          user?.author?.profile?.name &&
                          Utils.minifyText(user?.author?.profile?.name)
                        }
                        label={Utils.minifyPubky(
                          user.author.uri.replace('pubky:', '')
                        )}
                      />
                      {pubkeyUser ? (
                        <Button.Medium
                          className="w-[154px] bg-transparent cursor-default"
                          icon={<Icon.Check />}
                        >
                          Me
                        </Button.Medium>
                      ) : initLoadingFollowers ? (
                        <Button.Medium
                          disabled
                          icon={<Icon.LoadingSpin size="16" />}
                          className="w-[154px]"
                        >
                          Loading
                        </Button.Medium>
                      ) : isFollowed ? (
                        <Button.Medium
                          onClick={
                            loadingFollowers[user?.author?.id]
                              ? undefined
                              : () => unfollowUser(user?.author?.id)
                          }
                          disabled={loadingFollowers[user?.author?.id]}
                          loading={loadingFollowers[user?.author?.id]}
                          icon={<Icon.UserMinus size="16" />}
                          className="w-[154px]"
                        >
                          Unfollow
                        </Button.Medium>
                      ) : (
                        <Button.Medium
                          onClick={
                            loadingFollowers[user?.author?.id]
                              ? undefined
                              : () => followUser(user?.author?.id)
                          }
                          disabled={loadingFollowers[user?.author?.id]}
                          loading={loadingFollowers[user?.author?.id]}
                          icon={<Icon.UserPlus size="16" />}
                          className="w-[154px]"
                        >
                          Follow
                        </Button.Medium>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
