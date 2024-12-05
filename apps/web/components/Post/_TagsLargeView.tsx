'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Button,
  Icon,
  Input,
  Post as PostUI,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Modal from '../Modal';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { ImageByUri } from '../ImageByUri';
import { PostTag, PostView } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import Link from 'next/link';

interface TagsLargeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
}

export default function TagsLargeView({ post }: TagsLargeViewProps) {
  const { pubky, createTag, deleteTag } = usePubkyClientContext();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [tag, setTag] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>(
    {}
  );
  const [loadingTags, setLoadingTags] = useState('');
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags
        .slice()
        .sort((a, b) => b?.taggers_count - a?.taggers_count);
      setTags(sortedTags);
    }
  }, [post?.tags]);

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(tag);
    await deleteTag(post?.details?.author, post?.details?.id, tag);
    // delete my user from tag from post.tags
    const newTags = tags.map((tagObj) => {
      if (tagObj.label === tag) {
        return {
          ...tagObj,
          taggers_count: tagObj.taggers_count - 1,
          taggers: tagObj.taggers.filter((fromItem) => fromItem !== pubky),
        };
      }
      return tagObj;
    });
    setTags(newTags);
    setLoadingTags('');
  };

  const handleAddTag = async (tag: string) => {
    setLoadingTags(tag);
    await createTag(post?.details?.author, post?.details?.id, tag);
    // add tag to post.tags
    const newTags: PostTag[] = tags.map((tagObj) => {
      if (tagObj.label === tag) {
        return {
          ...tagObj,
          taggers_count: tagObj.taggers_count + 1,
          taggers: [...tagObj.taggers, pubky ?? ''],
        };
      }
      return tagObj;
    });
    setTags(newTags);
    setLoadingTags('');
  };

  useEffect(() => {
    const fetchProfileImages = async () => {
      const images: { [key: string]: string } = {};

      const taggerPromises = tags.flatMap((tagObj) =>
        tagObj?.taggers
          ?.map((fromItem) => {
            if (fromItem && !images[fromItem]) {
              return getUserProfile(fromItem, pubky ?? '')
                .then((profile) => {
                  images[fromItem] =
                    profile?.details?.image || '/images/webp/Userpic.webp';
                })
                .catch(() => {
                  images[fromItem] = '/images/webp/Userpic.webp';
                });
            }
            return null;
          })
          .filter(Boolean)
      );

      await Promise.all(taggerPromises);
      setProfileImages(images);
    };

    if (tags.length > 0) {
      fetchProfileImages();
    }
  }, [tags, pubky]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value.toLowerCase().replace(/\s/g, '');
    setTag(valueWithoutSpaces);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  return (
    <div
      className="mt-2 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div className={`flex-col inline-flex gap-2`}>
        <div className="w-96 mb-4 flex gap-2 items-center">
          <Icon.Tag size="14" color="white" />
          <Typography.Label className="text-opacity-30">
            {tags.length > 0 ? 'Top tags' : 'Tag Post'}
          </Typography.Label>
          {tags.length > 0 && (
            <Button.Medium
              onClick={() => setShowModalTag(true)}
              className="w-auto h-8 px-3 py-2"
            >
              See all
            </Button.Medium>
          )}
        </div>
        {tags.length === 0 && (
          <div>
            {showEmojis && (
              <div
                className="absolute translate-y-[10%] translate-x-[30%] z-10"
                ref={wrapperRefEmojis}
              >
                <EmojiPicker
                  theme={Theme.DARK}
                  emojiStyle={EmojiStyle.TWITTER}
                  onEmojiClick={(emojiObject) => {
                    const emojiLength = new Blob([emojiObject.emoji]).size / 2;

                    if (tag.length + emojiLength <= 20) {
                      setTag(tag + emojiObject.emoji);
                    }
                    setShowEmojis(false);
                  }}
                />
              </div>
            )}
            <Input.Text
              placeholder="tag"
              value={tag}
              className="w-96 mt-2 flex items-center"
              maxLength={20}
              onChange={handleChange}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleAddTag(tag);
                  setTag('');
                }
              }}
              action={
                <div className="flex gap-2">
                  <Button.Action
                    icon={<Icon.Plus size="18" />}
                    className={tag ? 'flex' : 'hidden'}
                    variant="custom"
                    size="medium"
                    onClick={() => {
                      handleAddTag(tag);
                      setTag('');
                    }}
                  />
                  <Button.Action
                    variant="custom"
                    icon={<Icon.Smiley size="32" />}
                    size="medium"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowEmojis(true);
                    }}
                  />
                </div>
              }
            />
          </div>
        )}
        {tags.map((tagObj, index) => {
          const isTagFound = tagObj?.taggers.some(
            (fromItem) => fromItem === pubky
          );

          const displayedImages = tagObj?.taggers
            .slice(0, 4)
            .map((fromItem) => profileImages[fromItem])
            .filter(Boolean);

          const extraImagesCount =
            tagObj?.taggers.length - displayedImages.length;

          return (
            <PostUI.Footer key={`${index}-${tagObj?.label}`}>
              <div className="flex gap-2">
                {tagObj.taggers_count > 0 && (
                  <PostUtil.Tag
                    clicked={isTagFound}
                    color={
                      tagObj?.label && Utils.generateRandomColor(tagObj?.label)
                    }
                    onClick={() =>
                      isTagFound
                        ? handleDeleteTag(tagObj?.label)
                        : handleAddTag(tagObj?.label)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(tagObj?.label, 13)}
                      {loadingTags === tagObj?.label ? (
                        <Icon.LoadingSpin size="16" />
                      ) : (
                        <Typography.Caption
                          variant="bold"
                          className="text-opacity-60"
                        >
                          {tagObj?.taggers_count}
                        </Typography.Caption>
                      )}
                    </div>
                  </PostUtil.Tag>
                )}
                <Link href={`/search?tags=${tagObj?.label}`}>
                  <Button.Action
                    variant="custom"
                    size="small"
                    icon={<Icon.MagnifyingGlassLeft size="14" />}
                    className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                  />
                </Link>
              </div>
              <div className="flex">
                {displayedImages.map((image, imageIndex) => (
                  <ImageByUri
                    width={32}
                    height={32}
                    key={index}
                    className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                      imageIndex > 0 && '-ml-2'
                    }`}
                    alt={`tag-${imageIndex + 1}`}
                    uri={image}
                  />
                ))}
                {extraImagesCount > 0 && (
                  <PostUtil.Counter className="-ml-2">
                    +{extraImagesCount}
                  </PostUtil.Counter>
                )}
              </div>
            </PostUI.Footer>
          );
        })}
      </div>
      <Modal.Tag
        post={post}
        tags={tags}
        updatePostInTimeline={(newTag: PostView) => {
          setLoadingTags(newTag?.details.content);
          setTags(newTag.tags);
          setLoadingTags('');
        }}
        handleAddTag={handleAddTag}
        handleDeleteTag={handleDeleteTag}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
    </div>
  );
}
