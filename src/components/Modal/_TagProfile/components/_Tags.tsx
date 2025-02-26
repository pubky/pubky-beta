import { Button, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { useUtilsTag } from './_Utils';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { UserTags, UserView } from '@/types/User';

interface TagsProps {
  profileTags: UserTags[];
  setProfileTags: React.Dispatch<React.SetStateAction<UserTags[]>>;
  pubkyUser?: string;
  user?: UserView | null;
}

export default function Tags({ profileTags, setProfileTags, pubkyUser, user }: TagsProps) {
  const {
    addProfileTag,
    selectedTag,
    setSelectedTag,
    allTags,
    tagImages,
    deleteProfileTag,
    loadingTags,
    hasMore,
    loader,
    pubky,
    taggers,
    userProfiles,
    followedUser,
    initLoadingFollowers,
    loadingFollowers,
    unfollowUser,
    followUser,
    hasMoreTaggers,
    loaderTaggers
  } = useUtilsTag({ profileTags, setProfileTags, pubkyUser, user });

  return (
    <>
      {allTags.length > 0 ? (
        <>
          {!selectedTag && (
            <>
              {allTags.map((tag, index) => {
                const isTagFound = tag?.relationship || false;

                const displayedImages = tagImages[tag.label] || [];
                const extraImagesCount = tag?.taggers_count - displayedImages.length;

                return (
                  <div className="flex gap-2" key={index}>
                    <PostUtil.Tag
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        isTagFound ? deleteProfileTag(tag?.label) : addProfileTag(tag?.label);
                      }}
                      color={tag?.label && Utils.generateRandomColor(tag?.label)}
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag?.label, 21)}
                        {loadingTags === tag?.label ? (
                          <Icon.LoadingSpin size="12" />
                        ) : (
                          <Typography.Caption variant="bold" className="text-opacity-60">
                            {tag?.taggers_count}
                          </Typography.Caption>
                        )}
                      </div>
                    </PostUtil.Tag>

                    <Link href={`/search?tags=${tag?.label}`}>
                      <Button.Action
                        variant="custom"
                        size="small"
                        icon={<Icon.MagnifyingGlassLeft size="14" />}
                        className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                      />
                    </Link>
                    <div
                      onClick={() => setSelectedTag && setSelectedTag(tag)}
                      className="cursor-pointer flex items-center"
                    >
                      {displayedImages.map((image, imageIndex) => (
                        <ImageByUri
                          width={32}
                          height={32}
                          key={imageIndex}
                          className={`min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] rounded-full shadow justify-center items-center flex ${
                            imageIndex > 0 && '-ml-2'
                          }`}
                          alt={`tag-${imageIndex + 1}`}
                          uri={image}
                        />
                      ))}
                      {extraImagesCount > 0 && (
                        <>
                          <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>
                        </>
                      )}
                      <Button.Action
                        variant="custom"
                        icon={<Icon.CaretRight size="16" />}
                        className="-ml-2"
                        size="small"
                      />
                    </div>
                  </div>
                );
              })}
              {hasMore && (
                <div ref={loader}>
                  <Icon.LoadingSpin />
                </div>
              )}
            </>
          )}
          {selectedTag && (
            <>
              <div className="flex gap-2 items-center mb-2">
                <div onClick={() => setSelectedTag && setSelectedTag(null)} className="cursor-pointer">
                  <Button.Action variant="custom" icon={<Icon.CaretLeft size="16" />} size="small" />
                </div>
                {selectedTag && (
                  <PostUtil.Tag
                    clicked={selectedTag.relationship || false}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectedTag?.taggers.some((fromItem) => fromItem === pubky)
                        ? deleteProfileTag(selectedTag.label)
                        : addProfileTag(selectedTag.label);
                    }}
                    color={selectedTag.label && Utils.generateRandomColor(selectedTag.label)}
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(selectedTag.label.replace(' ', ''), 20)}
                      {loadingTags === selectedTag?.label ? (
                        <Icon.LoadingSpin size="12" />
                      ) : (
                        <Typography.Caption variant="bold" className="text-opacity-60">
                          {selectedTag?.taggers_count}
                        </Typography.Caption>
                      )}
                    </div>
                  </PostUtil.Tag>
                )}
                <Link href={`/search?tags=${selectedTag.label}`}>
                  <Button.Action
                    variant="custom"
                    size="small"
                    icon={<Icon.MagnifyingGlassLeft size="14" />}
                    className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                  />
                </Link>
              </div>
              {taggers?.map((user, userIndex) => {
                const profile = userProfiles[user];
                const pubkeyUser = pubky && user.includes(pubky);
                const isFollowed = followedUser[user];

                return (
                  <div key={userIndex} className="w-full flex justify-between gap-10">
                    <SideCard.User
                      uri={profile?.details?.id.replace('pubky:', '')}
                      uriImage={profile?.details?.image || '/images/webp/Userpic.webp'}
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
              {hasMoreTaggers && (
                <div ref={loaderTaggers}>
                  <Icon.LoadingSpin />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <Typography.Body variant="small" className="text-opacity-50">
          No tags yet
        </Typography.Body>
      )}
    </>
  );
}
