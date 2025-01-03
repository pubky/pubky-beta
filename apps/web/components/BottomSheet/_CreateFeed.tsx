'use client';

import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import {
  BottomSheet,
  Button,
  Icon,
  Input,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';

interface CreateFeedProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setTagsFeed: React.Dispatch<React.SetStateAction<string[]>>;
  tagsFeed: string[];
  setNameFeed: React.Dispatch<React.SetStateAction<string>>;
  nameFeed: string;
  handleAddFeed: (feedToAdd: ICustomFeed, name: string) => void;
  title?: string;
  className?: string;
}

const iconsReach = {
  all: <Icon.Broadcast />,
  following: <Icon.UsersRight />,
  friends: <Icon.Smiley />,
};

const iconsSort = {
  recent: <Icon.Asterisk />,
  popularity: <Icon.Fire />,
};

const iconsLayout = {
  columns: <Icon.ThreeColumns />,
  wide: <Icon.List />,
  visual: <Icon.SquaresFour color="gray" />,
};

export default function CreateFeed({
  show,
  setShow,
  setTagsFeed,
  tagsFeed,
  setNameFeed,
  nameFeed,
  handleAddFeed,
  title,
  className,
}: CreateFeedProps) {
  const { searchTags } = usePubkyClientContext();
  const { reach, layout, sort } = useFilterContext();
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTagsFeed(searchTags);
  }, [searchTags]);

  const handleSubmit = async () => {
    setLoading(true);
    const feed: ICustomFeed = {
      tags: tagsFeed,
      reach: reach,
      layout: layout,
      sort: sort,
      content: 'all',
    };

    await handleAddFeed(feed, nameFeed);

    setNameFeed('');
    setTagsFeed([]);
    setLoading(false);
    setShow(false);
  };

  const handleAddTag = () => {
    if (tagsFeed.length >= 4) {
      setTagsError(true);
    } else {
      const trimmedTag = tag.trim();
      if (trimmedTag !== '' && !tagsFeed.includes(trimmedTag)) {
        setTagsFeed([...tagsFeed, trimmedTag]);
        setTag('');
      }
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    tagsFeed &&
      setTagsFeed(tagsFeed.filter((_, index) => index !== indexToRemove));
    if (tagsFeed && tagsFeed.length <= 4) {
      setTagsError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTag(valueWithoutSpaces);
  };

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Save Feed'}
      className={className}
    >
      <div className="my-4 flex flex-col sm:flex-row gap-8">
        <div className="w-full order-2 sm:order-1">
          <div>
            <Input.Text
              value={nameFeed}
              maxLength={20}
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNameFeed(e.target.value)
              }
              placeholder="Add Feed name"
            />
          </div>
          <div className="flex flex-row w-full mt-4">
            <Input.Text
              placeholder="tag"
              value={tag}
              maxLength={20}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              action={
                <div className="flex gap-2">
                  <Button.Action
                    id="add-btn"
                    icon={<Icon.Plus size="18" />}
                    variant="custom"
                    size="medium"
                    className={tag ? 'flex' : 'hidden'}
                    onClick={handleAddTag}
                  />
                </div>
              }
            />
          </div>
          <div className="mt-2 justify-start items-start">
            {tagsFeed && tagsFeed.length > 0 ? (
              <div className="justify-start items-start">
                {tagsFeed.map((tag, index) => (
                  <PostUtil.Tag
                    key={index}
                    action={
                      <div
                        className="flex items-center"
                        onClick={() => handleRemoveTag(index)}
                      >
                        <Icon.X size="16" />
                      </div>
                    }
                    clicked
                    color={tag && Utils.generateRandomColor(tag)}
                    className="mr-2 my-1"
                  >
                    {tag}
                  </PostUtil.Tag>
                ))}
              </div>
            ) : (
              <Typography.Body variant="small" className="text-opacity-30">
                No tags yet.
              </Typography.Body>
            )}
          </div>
          {tagsError && (
            <Typography.Body variant="small" className="text-[#e95164]">
              Max 4 tags
            </Typography.Body>
          )}
        </div>
        <div className="flex gap-4 sm:gap-2 order-1 sm:order-2 sm:flex-col w-[180px]">
          <div>
            <Typography.Label className="text-opacity-30">
              Reach
            </Typography.Label>
            <div className="flex gap-2">
              <div>{iconsReach[reach]}</div>
              <Typography.Body variant="medium-bold">
                {reach?.charAt(0).toUpperCase() + reach?.slice(1)}
              </Typography.Body>
            </div>
          </div>
          <div>
            <Typography.Label className="text-opacity-30">
              Sort
            </Typography.Label>
            <div className="flex gap-2">
              <div>{iconsSort[sort]}</div>
              <Typography.Body variant="medium-bold">
                {sort?.charAt(0).toUpperCase() + sort?.slice(1)}
              </Typography.Body>
            </div>
          </div>
          <div>
            <Typography.Label className="text-opacity-30">
              Content
            </Typography.Label>
            <div className="flex gap-2">
              <div>
                <Icon.Stack size="24" />
              </div>
              <Typography.Body variant="medium-bold">All</Typography.Body>
            </div>
          </div>
          <div>
            <Typography.Label className="text-opacity-30">
              Layout
            </Typography.Label>
            <div className="flex gap-2">
              <div>{iconsLayout[layout]}</div>
              <Typography.Body variant="medium-bold">
                {layout?.charAt(0).toUpperCase() + layout?.slice(1)}
              </Typography.Body>
            </div>
          </div>
        </div>
      </div>
      <Button.Medium
        loading={loading}
        disabled={!nameFeed || tagsFeed?.length === 0}
        icon={
          <Icon.Activity
            size="16"
            color={!nameFeed || tagsFeed?.length === 0 ? 'grey' : 'white'}
          />
        }
        onClick={() =>
          loading || !nameFeed || tagsFeed?.length === 0
            ? undefined
            : handleSubmit()
        }
        className="mt-4"
      >
        Save Feed
      </Button.Medium>
    </BottomSheet.Root>
  );
}
