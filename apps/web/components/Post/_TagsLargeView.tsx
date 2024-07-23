'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Button,
  Icon,
  Input,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import { IPost, ITaggedPost } from '@/types';
import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import Modal from '../Modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

interface TagsLargeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
}

export default function TagsLargeView({ post }: TagsLargeViewProps) {
  const router = useRouter();
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const { pubky, posts, setPosts, getPost, deleteTag, createTag } =
    useClientContext();
  const [tags, setTags] = useState<ITaggedPost[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITaggedPost | null>(null);
  const [tag, setTag] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post?.tags) {
      //const sortedTags = post?.tags.slice().sort((a, b) => b.count - a.count);
      setTags(post.tags);
    }
  }, [post?.tags]);

  const updatePosts = async () => {
    const updatedPost = await getPost(post.uri);

    if (!updatedPost) return;

    const updatedPosts = Object.keys(posts).map((key) => {
      if (posts[key].uri === updatedPost.uri) return updatedPost;
      return posts[key];
    });
    setPosts(updatedPosts);
  };

  const handleDeleteTag = async (tag: string) => {
    await deleteTag(post.uri, tag);
    updatePosts();
  };

  const handleAddTag = async (tag: string) => {
    await createTag(post.uri, tag);
    updatePosts();
  };

  {
    /**  const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    router.push('/search');
  };

  if (post?.tags?.length === 0) {
    return <></>;
  }*/
  }
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
          <Icon.Tag size="14" />
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
                    setTag(tag + emojiObject.emoji);
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
          const isTagFound = tagObj.from.some(
            (fromItem) => fromItem.author.id === pubky
          );

          const images = tagObj.from.map((fromItem) => {
            if (fromItem.author?.profile?.image) {
              return fromItem.author.profile.image;
            }
            return '/images/Userpic.png';
          });
          const displayedImages = images.slice(0, 4);
          const extraImagesCount = images.length - displayedImages.length;

          return (
            <PostUI.Footer key={index}>
              <div className="flex gap-2">
                <TooltipUI.Root
                  delay={200}
                  setShowTooltip={setShowTooltipProfile}
                  tagId={tagObj.tag}
                >
                  {showTooltipProfile === tagObj.tag && (
                    <Tooltip.Tag
                      setSelectedTag={setSelectedTag}
                      setShowModalTags={setShowModalTag}
                      tags={tagObj}
                    />
                  )}
                  <PostUtil.Tag
                    clicked={isTagFound}
                    color={tagObj.tag && Utils.generateRandomColor(tagObj.tag)}
                    onClick={() =>
                      isTagFound
                        ? handleDeleteTag(tagObj.tag)
                        : handleAddTag(tagObj.tag)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(tagObj.tag.replace(' ', ''), 7)}
                      <Typography.Caption
                        variant="bold"
                        className="text-opacity-30"
                      >
                        {tagObj.count}
                      </Typography.Caption>
                    </div>
                  </PostUtil.Tag>
                </TooltipUI.Root>
                <Button.Action
                  variant="custom"
                  size="small"
                  icon={<Icon.MagnifyingGlassLeft size="14" />}
                  onClick={() => router.push(`/search?tags=${tagObj}`)}
                  className="cursor-pointer text-fuchsia-500 text-opacity-50 hover:text-opacity-80"
                />
                <div
                  onClick={() => setShowModalTag(true)}
                  className="cursor-pointer flex items-center"
                >
                  {displayedImages.map((image, imageIndex) => (
                    <Image
                      width={32}
                      height={32}
                      key={index}
                      className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                        imageIndex > 0 && '-ml-2'
                      }`}
                      alt={`tag-${imageIndex + 1}`}
                      src={image}
                    />
                  ))}
                  {extraImagesCount > 0 && (
                    <PostUtil.Counter className="-ml-2">
                      +{extraImagesCount}
                    </PostUtil.Counter>
                  )}
                </div>
              </div>
              {/* <Button.Action
                variant="custom"
                size="small"
                icon={isTagFound ? <Icon.Minus /> : <Icon.Plus />}
                onClick={(event) => {
                  event.stopPropagation();
                  isTagFound
                    ? handleDeleteTag(tagObj.tag)
                    : handleAddTag(tagObj.tag);
                }}
              />
              <PostUtil.Counter counter={tagObj.count} />
              {tagObj?.from.slice(0, 5).map((fromItem, fromIndex: number) => (
                <Image
                  width={32}
                  height={32}
                  alt={`pic-${fromIndex + 1}`}
                  key={fromIndex}
                  className={`w-[32px] h-[32px] rounded-full ${
                    fromIndex !== 0 ? '-ml-5' : ''
                  }`}
                  src={fromItem.author?.profile?.image || '/images/Userpic.png'}
                />
              ))} */}
            </PostUI.Footer>
          );
        })}
      </div>
      <Modal.Tag
        post={post}
        tags={tags}
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
