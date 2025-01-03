'use client';

import {
  BottomSheet,
  Button,
  Icon,
  Input,
  PostUtil,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';

interface TagCreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagCreatePost({
  show,
  setShow,
  title,
  className,
  arrayTags,
  setArrayTags,
}: TagCreatePostProps) {
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTag(valueWithoutSpaces);
  };

  const handleAddTag = () => {
    if (arrayTags.length >= 4) {
      setTagsError(true);
    } else {
      const trimmedTag = tag.trim();
      if (trimmedTag !== '') {
        if (!arrayTags.includes(trimmedTag)) {
          setTag('');
          setArrayTags([...arrayTags, trimmedTag]);
        } else {
          setTag('');
        }
      }
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setArrayTags(arrayTags.filter((_, index) => index !== indexToRemove));
    if (arrayTags.length <= 4) {
      setTagsError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };
  if (!show) return null;

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Tag'}
      className={className}
    >
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <div className="w-full flex-col inline-flex">
          <div>
            <div className="mt-2 justify-start items-start">
              {arrayTags.length > 0 ? (
                <div className="justify-start items-start">
                  {arrayTags.map((tag, index) => (
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
          </div>
          <div className="flex flex-row w-full mt-4">
            <Input.Text
              placeholder="tag"
              value={tag}
              maxLength={20}
              onChange={handleChange}
              autoFocus
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
          {tagsError && (
            <Typography.Body variant="small" className="text-[#e95164]">
              Max 4 tags
            </Typography.Body>
          )}
        </div>
      </div>
    </BottomSheet.Root>
  );
}
