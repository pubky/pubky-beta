import { useFilterContext } from '@/contexts';
import { ICustomFeed } from '@/types';
import {
  Button,
  Icon,
  Input,
  Modal,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';

interface CreateFeedProps {
  showModalCreateFeed: boolean;
  setShowModalCreateFeed: React.Dispatch<React.SetStateAction<boolean>>;
  setTagsFeed: React.Dispatch<React.SetStateAction<string[]>>;
  tagsFeed: string[];
  setNameFeed: React.Dispatch<React.SetStateAction<string>>;
  nameFeed: string;
  handleAddFeed: (feedToAdd: ICustomFeed, name: string) => void;
}

export default function CreateFeed({
  showModalCreateFeed,
  setShowModalCreateFeed,
  setTagsFeed,
  tagsFeed,
  setNameFeed,
  nameFeed,
  handleAddFeed,
}: CreateFeedProps) {
  const { reach, layout, sort } = useFilterContext();
  const modalCreateFeedRef = useRef<HTMLDivElement>(null);
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

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
    setShowModalCreateFeed(false);
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

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalCreateFeedRef.current &&
        !modalCreateFeedRef.current.contains(event.target as Node)
      ) {
        setShowModalCreateFeed(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalCreateFeedRef, setShowModalCreateFeed]);

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
    <Modal.Root
      modalRef={modalCreateFeedRef}
      show={showModalCreateFeed}
      closeModal={() => {
        setShowModalCreateFeed(false);
        setTagsFeed([]);
      }}
      className="md:w-[592px] max-h-[600px] justify-start"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalCreateFeed(false);
          setTagsFeed([]);
        }}
      />
      <Modal.Header title="Create Feed" />
      <Typography.Body variant="medium">
        Search for one or more tags and choose your preferred layout, sorting,
        content and reach.
      </Typography.Body>
      <div className="my-4">
        <div className="flex gap-8 flex-wrap mb-4">
          <div>
            <Typography.Body className="text-opacity-50" variant="small-bold">
              Reach
            </Typography.Body>
            <Typography.Body className="-mt-1" variant="medium-bold">
              {reach?.charAt(0).toUpperCase() + reach?.slice(1)}
            </Typography.Body>
          </div>
          <div>
            <Typography.Body className="text-opacity-50" variant="small-bold">
              Sort
            </Typography.Body>
            <Typography.Body className="-mt-1" variant="medium-bold">
              {sort?.charAt(0).toUpperCase() + sort?.slice(1)}
            </Typography.Body>
          </div>
          <div>
            <Typography.Body className="text-opacity-50" variant="small-bold">
              Layout
            </Typography.Body>
            <Typography.Body className="-mt-1" variant="medium-bold">
              {layout?.charAt(0).toUpperCase() + layout?.slice(1)}
            </Typography.Body>
          </div>
          <div>
            <Typography.Body className="text-opacity-50" variant="small-bold">
              Content
            </Typography.Body>
            <Typography.Body className="-mt-1" variant="medium-bold">
              All
            </Typography.Body>
          </div>
        </div>
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
          {/* <Input.Label value="Add tag" /> */}
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
                <Button.Action
                  id="emoji-btn"
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
      <Button.Medium
        loading={loading}
        disabled={!nameFeed || tagsFeed?.length === 0}
        onClick={() =>
          loading || !nameFeed || tagsFeed?.length === 0
            ? undefined
            : handleSubmit()
        }
        className="mt-4"
      >
        Save
      </Button.Medium>
    </Modal.Root>
  );
}
