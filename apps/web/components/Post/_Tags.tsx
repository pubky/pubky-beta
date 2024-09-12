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
import { useClientContext } from '@/contexts';
import { IPost, ITaggedPost } from '@/types';
import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import Modal from '../Modal';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
  largeView?: boolean;
}

export default function Tags({ post, largeView = false }: PostProps) {
  const [showTooltipTag, setShowTooltipTag] = useState('');
  const { pubky, posts, setPosts, getPost, deleteTag, createTag } =
    useClientContext();
  const [tags, setTags] = useState<ITaggedPost[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITaggedPost | null>(null);

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

  return (
    <div
      className="mt-6 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div id='tags' className={`flex-row inline-flex gap-2 mt-6 lg:mt-0`}>
        <Button.Action
          id='tag-btn'
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
            const isTagFound = tagObj.from.some(
              (fromItem) => fromItem.author.id === pubky
            );

            return (
              <PostUI.Footer key={index}>
                <TooltipUI.Root
                  delay={800}
                  setShowTooltip={setShowTooltipTag}
                  tagId={tagObj.tag}
                >
                  {showTooltipTag === tagObj.tag && (
                    <Tooltip.Tag2
                      setSelectedTag={setSelectedTag}
                      setShowModalTags={setShowModalTag}
                      tags={tagObj}
                    />
                  )}
                  <PostUtil.Tag
                    id={`tag-${index}`}
                    clicked={isTagFound}
                    color={tagObj.tag && Utils.generateRandomColor(tagObj.tag)}
                    onClick={() =>
                      isTagFound
                        ? handleDeleteTag(tagObj.tag)
                        : handleAddTag(tagObj.tag)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(tagObj.tag.replace(' ', ''), 14)}
                      <Typography.Caption
                        variant="bold"
                        className="text-opacity-30"
                      >
                        {tagObj.count}
                      </Typography.Caption>
                    </div>
                  </PostUtil.Tag>
                </TooltipUI.Root>
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
