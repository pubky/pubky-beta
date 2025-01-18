'use client';

import { PostUtil, Typography } from '@social/ui-shared';
import { UserTags, UserView } from '@/types/User';
import { Utils } from '@social/utils-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';

interface TagsProps {
  influencer: UserView | undefined;
}

export function Tags({ influencer }: TagsProps) {
  const { addAlert } = useAlertContext();
  const { pubky, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const usePubky = influencer?.details?.id || pubky || '';
  const [profileTags, setProfileTags] = useState<UserTags[]>(
    influencer?.tags ?? [],
  );

  useEffect(() => {
    setProfileTags(influencer?.tags ?? []);
  }, [influencer?.tags]);

  const handleAddProfileTag = async (tag: string) => {
    if (usePubky) {
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        if (!tagExists.taggers.includes(pubky || '')) {
          const updatedTags = profileTags.map((t) =>
            t.label === tag
              ? {
                  ...t,
                  taggers: [...t.taggers, pubky || ''],
                  taggers_count: t.taggers_count + 1,
                }
              : t,
          );
          setProfileTags(updatedTags);
        }
      } else {
        const newTag = {
          label: tag,
          taggers: [pubky || ''],
          taggers_count: 1,
        };
        setProfileTags([...profileTags, newTag]);
      }

      const response = await createTagProfile(usePubky, tag);
      if (!response) {
        addAlert('Error adding tag', 'warning');
      }
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    if (usePubky) {
      const updatedTags = profileTags
        .map((t) =>
          t.label === tag
            ? {
                ...t,
                taggers: t.taggers.filter((tagger) => tagger !== pubky),
                taggers_count: Math.max(t.taggers_count - 1, 0),
              }
            : t,
        )
        .filter((t) => t.taggers_count > 0);
      setProfileTags(updatedTags);

      const response = await deleteTagProfile(usePubky, tag);
      if (!response) {
        addAlert('Error deleting tag', 'warning');
      }
    }
  };

  return (
    <div className="flex lg:justify-end gap-2 items-center lg:w-full">
      {profileTags.slice(0, 3).map((tag, index) => {
        const isTagFound = tag.taggers.includes(pubky || '');

        return (
          <PostUtil.Tag
            key={index}
            clicked={isTagFound}
            onClick={(event) => {
              event.stopPropagation();
              isTagFound
                ? handleDeleteProfileTag(tag.label)
                : handleAddProfileTag(tag.label);
            }}
            color={tag.label && Utils.generateRandomColor(tag.label)}
          >
            <div className="flex gap-2 items-center">
              {Utils.minifyText(tag.label, 20)}
              <Typography.Caption variant="bold" className="text-opacity-60">
                {tag.taggers_count}
              </Typography.Caption>
            </div>
          </PostUtil.Tag>
        );
      })}
    </div>
  );
}
