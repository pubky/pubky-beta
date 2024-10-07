'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Icon,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import Modal from '../Modal';
import { PostTag, PostView } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
}

export default function Tags({ post, largeView = false }: PostProps) {
  const [showTooltipTag, setShowTooltipTag] = useState('');
  const { pubky, createTag, deleteTag } = usePubkyClientContext();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags
        .slice()
        .sort((a, b) => b.taggers_count - a.taggers_count);
      setTags(sortedTags);
    }
  }, [post?.tags]);

  {
    /**

  const updatePosts = async () => {
    const updatedPost = await getPost(post.uri);

    if (!updatedPost) return;

    const updatedPosts = Object.keys(posts).map((key) => {
      if (posts[key].uri === updatedPost.uri) return updatedPost;
      return posts[key];
    });
    setPosts(updatedPosts);
  };*/
  }

  const handleDeleteTag = async (tag: string) => {
    await deleteTag(post?.details?.id, tag);
  };

  const handleAddTag = async (tag: string) => {
    await createTag(post?.details?.author, post?.details?.id, tag);
  };

  {
    /**const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    router.push('/search');
  };*/
  }

  {
    /** if (post?.tags?.length === 0) {
    return <></>;
  } */
  }

  return (
    <div
      className="mt-6 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div id="tags" className={`flex-row inline-flex gap-2 mt-6 lg:mt-0`}>
        <Button.Action
          id="tag-btn"
          size="small"
          variant="custom"
          icon={<Icon.Tag size="16" />}
          counter={post?.tags?.length}
          onClick={() => {
            setShowModalTag(true);
          }}
        />
        {!largeView &&
          tags.map((tagObj, index) => {
            const isTagFound = tagObj?.taggers.some(
              (fromItem) => fromItem === pubky
            );

            return (
              <PostUI.Footer key={index}>
                <TooltipUI.Root
                  delay={800}
                  setShowTooltip={setShowTooltipTag}
                  tagId={tagObj?.label}
                >
                  {showTooltipTag === tagObj?.label && (
                    <Tooltip.Tag2
                      setSelectedTag={setSelectedTag}
                      setShowModalTags={setShowModalTag}
                      tags={tagObj}
                    />
                  )}
                  <PostUtil.Tag
                    id={`tag-${index}`}
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
                      {Utils.minifyText(tagObj?.label.replace(' ', ''), 14)}
                      <Typography.Caption
                        variant="bold"
                        className="text-opacity-30"
                      >
                        {tagObj?.taggers_count}
                      </Typography.Caption>
                    </div>
                  </PostUtil.Tag>
                </TooltipUI.Root>
                {/**
                <Button.Action
                  variant="custom"
                  size="small"
                  icon={isTagFound ? <Icon.Minus /> : <Icon.Plus />}
                  onClick={(event) => {
                    event.stopPropagation();
                    isTagFound
                      ? handleDeleteTag(tagObj?.label)
                      : handleAddTag(tagObj?.label);
                  }}
                />
                <PostUtil.Counter>
                  {Number(tagObj?.taggers_count)}
                </PostUtil.Counter>
                {tagObj?.taggers
                  .slice(0, 5)
                  .map((fromItem, fromIndex: number) => (
                    <Image
                      width={32}
                      height={32}
                      alt={`pic-${fromIndex + 1}`}
                      key={fromIndex}
                      className={`w-[32px] h-[32px] rounded-full ${
                        fromIndex !== 0 ? '-ml-5' : ''
                      }`}
                      src={fromItem?.tagger_id || '/images/Userpic.png'}
                    />
                  ))}*/}
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
