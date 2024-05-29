'use client';

import { useEffect, useState } from 'react';

import {
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { useClientContext } from '../../contexts/client';
import { IPost, ITaggedPost } from '../../types';
import { Utils } from './../../utils';
import Tooltip from '../Tooltip';
import Modal from '../Modal';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
}

export default function Tags({ post }: PostProps) {
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const { pubky, posts, setPosts, getPost, deleteTag, createTag } =
    useClientContext();
  const [sortedTags, setSortedTags] = useState<ITaggedPost[]>([]);
  const [showModalTags, setShowModalTags] = useState(false);

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags.slice().sort((a, b) => b.count - a.count);
      setSortedTags(sortedTags);
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

  // const handleTagSearch = (tag: string) => {
  //   if (searchTags.includes(tag)) return;

  //   if (searchTags.length < 3) {
  //     setSearchTags([...searchTags, tag]);
  //   } else {
  //     const newSearchTags = [...searchTags.slice(1), tag];
  //     setSearchTags(newSearchTags);
  //   }
  //   router.push('/search');
  // };

  if (post?.tags?.length === 0) {
    return <></>;
  }

  return (
    <div
      className="mt-6 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div className={`flex-row inline-flex gap-2 mt-6 lg:mt-0`}>
        {sortedTags.map((tagObj, index) => {
          const isTagFound = tagObj.from.some(
            (fromItem) => fromItem.author.id === pubky
          );

          return (
            <PostUI.Footer key={index}>
              <TooltipUI.Root
                delay={200}
                setShowTooltip={setShowTooltipProfile}
                tagId={tagObj.tag}
              >
                {showTooltipProfile === tagObj.tag && (
                  <Tooltip.Tag tags={tagObj} />
                )}
                <PostUtil.Tag
                  // onClick={(event) => {
                  //   event.stopPropagation();
                  //   handleTagSearch(tagObj.tag);
                  // }}
                  className={
                    isTagFound
                      ? 'hover:border-red-500 hover:bg-red-500 hover:bg-opacity-50'
                      : ''
                  }
                  clicked={isTagFound}
                  color="fuchsia"
                  onClick={() =>
                    isTagFound
                      ? handleDeleteTag(tagObj.tag)
                      : handleAddTag(tagObj.tag)
                  }
                >
                  {Utils.minifyText(tagObj.tag.replace(' ', ''))} (
                  {tagObj.count})
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
              /> */}
              {/* <PostUtil.Counter counter={tagObj.count} /> */}
              {/* {tagObj?.from.slice(0, 5).map((fromItem, fromIndex: number) => (
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
        <Typography.Body
          onClick={() => setShowModalTags(true)}
          className="cursor-pointer text-fuchsia-500 text-opacity-50 hover:text-opacity-80 mt-3 font-medium"
          variant="small"
        >
          Show all
        </Typography.Body>
      </div>
      <Modal.Tags
        post={post}
        showModalTags={showModalTags}
        setShowModalTags={setShowModalTags}
        handleAddTag={handleAddTag}
        handleDeleteTag={handleDeleteTag}
      />
    </div>
  );
}
