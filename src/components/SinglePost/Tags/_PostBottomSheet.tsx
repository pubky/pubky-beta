'use client';

import { PostView } from '@/types/Post';
import { Input, Button, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { TagsInteractionUtils } from './utils/_TagsInteractionUtils';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';
import EmojiPicker from '@/components/EmojiPicker';
import Link from 'next/link';
import React from 'react';
import Root from '../../ui-shared/lib/BottomSheet/_Root';

interface TagProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
  tagsError?: boolean;
}

export function PostBottomSheet({ show, setShow, post, title, className, tagsError }: TagProps) {
  const {
    selectedTag,
    addTag,
    deleteTag,
    allTags,
    setSelectedTag,
    loader,
    loadingTags,
    tagImages,
    hasMore,
    pubky,
    taggers,
    userProfiles,
    followedUser,
    initLoadingFollowers,
    followUser,
    unfollowUser,
    loaderTaggers,
    loadingFollowers,
    hasMoreTaggers,
    tag,
    setTag,
    showEmojis,
    setShowEmojis,
    wrapperRefEmojis,
    loading,
    inputRef
  } = TagsInteractionUtils(post);

  // Early return if no post or tags
  if (!post || !allTags) {
    return null;
  }

  // Render tag input editor section
  const renderTagEditor = () => (
    <div>
      {showEmojis && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" onClick={() => setShowEmojis(false)} />
          <div
            id="emoji-picker"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
            ref={wrapperRefEmojis}
          >
            <EmojiPicker
              onEmojiSelect={(emojiObject) => {
                setTag(tag + emojiObject.native);
                setShowEmojis(false);
              }}
              maxLength={20}
              currentInput={tag}
            />
          </div>
        </>
      )}
      <Input.Label value="New tag" />
      <div className="w-full mt-2">
        <Input.Tag
          ref={inputRef}
          value={tag}
          onChange={setTag}
          onAddTag={addTag}
          onEmojiPickerClick={() => setShowEmojis(true)}
          loading={loading}
          autoFocus
          variant="default"
          className="w-full"
        />
      </div>
      {tagsError && (
        <Typography.Body variant="small" className="text-[#e95164] mt-4">
          Max 4 tags
        </Typography.Body>
      )}
    </div>
  );

  // Render tags display section
  const renderTagsDisplay = () => (
    <div
      id="current-tags"
      className="justify-start items-start gap-2 flex flex-col overflow-y-auto min-w-[200px] max-h-[300px] scrollbar-thin scrollbar-webkit"
    >
      <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
      {allTags?.length > 0 ? (
        <>
          {!selectedTag && (
            <>
              {allTags.map((tag, index) => {
                const isTagFound = tag.relationship || false;
                const displayedImages = tagImages[tag.label] || [];
                const extraImagesCount = displayedImages.length > 4 ? displayedImages.length - 4 : 0;

                return (
                  <div className="flex gap-2" key={index}>
                    <PostUtil.Tag
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        isTagFound ? deleteTag(tag?.label) : addTag(tag?.label);
                      }}
                      color={Utils.generateRandomColor(tag?.label)}
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
                          id={userProfiles?.[tag?.label]?.details?.id}
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
                        <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>
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
                    clicked={selectedTag?.relationship || false}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectedTag?.taggers.some((fromItem) => fromItem === pubky)
                        ? deleteTag(selectedTag?.label)
                        : addTag(selectedTag?.label);
                    }}
                    color={selectedTag?.label && Utils.generateRandomColor(selectedTag?.label)}
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(selectedTag?.label, 21)}
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
                <Link href={`/search?tags=${selectedTag?.label}`}>
                  <Button.Action
                    variant="custom"
                    size="small"
                    icon={<Icon.MagnifyingGlassLeft size="14" />}
                    className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                  />
                </Link>
              </div>
              {taggers.map((user, userIndex) => {
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
        <Typography.Body variant="small" className="text-opacity-30">
          No tags yet.
        </Typography.Body>
      )}
    </div>
  );

  return (
    <Root show={show} setShow={setShow} title={title ?? 'Tag Post'} className={className}>
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {renderTagEditor()}
          {renderTagsDisplay()}
        </div>
      </div>
    </Root>
  );
}

export default PostBottomSheet;
