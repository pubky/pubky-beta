'use client';

import { Icon, PostUtil, Typography } from '@social/ui-shared';
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
  const userPubky = influencer?.details?.id || pubky || '';
  const [profileTags, setProfileTags] = useState<UserTags[]>(influencer?.tags ?? []);
  const [loadingTags, setLoadingTags] = useState('');

  useEffect(() => {
    setProfileTags(influencer?.tags ?? []);
  }, [influencer?.tags]);

  const handleAddProfileTag = async (tag: string) => {
    // loading tag
    setLoadingTags(tag);
    if (userPubky) {
      // before adding tag, check if tag already exists and is not the same pubky
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        // check if tag is the same pubky
        if (!tagExists.taggers.includes(pubky || '')) {
          setLoadingTags('');
          // update profileTags with new taggers
          const updatedTags = profileTags.map((t) =>
            t.label === tag
              ? {
                  ...t,
                  taggers: [...t.taggers, pubky || ''],
                  taggers_count: t.taggers_count + 1,
                  relationship: true
                }
              : t
          );
          setProfileTags(updatedTags);
        }
      } else {
        // update tag optimistic in the UI
        const newTag = {
          label: tag,
          taggers: [pubky || ''],
          taggers_count: 1,
          relationship: true
        };
        setProfileTags([...profileTags, newTag]);
      }

      const response = await createTagProfile(userPubky, tag);
      if (!response) {
        // show error message
        addAlert('Error adding tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    // loading tag
    setLoadingTags(tag);
    if (userPubky) {
      const updatedTags = profileTags
        .map((t) =>
          t.label === tag
            ? {
                ...t,
                taggers: t.taggers.filter((tagger) => tagger !== pubky),
                taggers_count: Math.max(t.taggers_count - 1, 0),
                relationship: false
              }
            : t
        )
        .filter((t) => t.taggers_count > 0);
      setProfileTags(updatedTags);

      const response = await deleteTagProfile(userPubky, tag);
      if (!response) {
        addAlert('Error deleting tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap lg:justify-end gap-2 items-center lg:w-full">
      {profileTags.slice(0, 3).map((tag, index) => {
        const isTagFound = tag.relationship || false;

        return (
          <PostUtil.Tag
            key={index}
            clicked={isTagFound}
            onClick={(event) => {
              event.stopPropagation();
              isTagFound ? handleDeleteProfileTag(tag.label) : handleAddProfileTag(tag.label);
            }}
            color={tag?.label && Utils.generateRandomColor(tag.label)}
          >
            <div className="flex gap-2 items-center">
              {Utils.minifyText(tag.label, 20)}
              {loadingTags === tag?.label ? (
                <Icon.LoadingSpin size="12" />
              ) : (
                <Typography.Caption variant="bold" className="text-opacity-60">
                  {tag.taggers_count}
                </Typography.Caption>
              )}
            </div>
          </PostUtil.Tag>
        );
      })}
    </div>
  );
}
