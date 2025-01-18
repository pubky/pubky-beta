'use client';

import { Icon, PostUtil } from '@social/ui-shared';
import { UserTags, UserView } from '@/types/User';
import { Utils } from '@social/utils-shared';
import { useAlertContext, useJoin, usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';

interface TagsProps {
  influencer: UserView | undefined;
}

export function Tags({ influencer }: TagsProps) {
  const { openJoin } = useJoin();
  const { addAlert } = useAlertContext();
  const { pubky, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const [profileTags, setProfileTags] = useState<UserTags[]>(
    influencer?.tags ?? [],
  );
  const [loadingTags, setLoadingTags] = useState('');

  useEffect(() => {
    setProfileTags(influencer?.tags ?? []);
  }, [influencer?.tags]);

  const handleAddProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse = creatorPubky || pubky;

    // loading tag
    setLoadingTags(tag);
    if (pubKeyToUse) {
      // before adding tag, check if tag already exists and is not the same pubky
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        // check if tag is the same pubky
        if (tagExists.taggers.includes(pubKeyToUse)) {
          setLoadingTags('');
        } else {
          // add tag to taggers
          tagExists.taggers_count++;

          // update profileTags with new taggers
          const newProfileTags = profileTags.map((t) => {
            if (t.label === tag) {
              return { ...t, taggers: [...t.taggers, pubKeyToUse] };
            }
            return t;
          });

          // update tag in UI
          setProfileTags(newProfileTags);
        }
      } else {
        // update tag optimistic in the UI
        setProfileTags([
          ...profileTags,
          {
            label: tag,
            taggers: [pubKeyToUse],
            taggers_count: 1,
          },
        ]);
      }
      const response = await createTagProfile(pubKeyToUse, tag);
      if (!response) {
        // show error message
        addAlert('Error adding tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  const handleDeleteProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse = creatorPubky || pubky;

    // loading tag
    setLoadingTags(tag);

    if (pubKeyToUse) {
      // check if tag exists in profileTags
      const tagExists = profileTags.find((t) => t.label === tag);
      if (tagExists) {
        // check if pubkeyToUse is in taggers
        if (tagExists.taggers.includes(pubky || '')) {
          // remove tagger from tag but keep the tag but update the taggers_count
          tagExists.taggers_count--;
          tagExists.taggers = tagExists.taggers.filter(
            (t) => t !== pubky || '',
          );
          setProfileTags(
            profileTags.map((t) => (t.label === tag ? tagExists : t)),
          );
        } else {
          // remove tag from taggers
          tagExists.taggers_count--;
          tagExists.taggers = tagExists.taggers.filter(
            (t) => t !== pubky || '',
          );
          setProfileTags(
            profileTags.map((t) => (t.label === tag ? tagExists : t)),
          );
        }
      }

      const response = await deleteTagProfile(pubKeyToUse, tag);
      if (!response) {
        addAlert('Error deleting tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  return (
    <div className="flex lg:justify-end gap-2 items-center lg:w-full">
      {influencer?.tags?.slice(0, 3).map((tag, index) => {
        const isTagFound = tag?.taggers?.some((fromItem) => fromItem === pubky);

        return (
          <PostUtil.Tag
            key={index}
            clicked={isTagFound}
            onClick={(event) => {
              event.stopPropagation();
              pubky
                ? isTagFound
                  ? handleDeleteProfileTag(influencer?.details?.id, tag?.label)
                  : handleAddProfileTag(influencer?.details?.id, tag?.label)
                : openJoin();
            }}
            color={tag?.label && Utils.generateRandomColor(tag?.label)}
          >
            <div className="flex gap-2 items-center">
              {Utils.minifyText(tag?.label, 20)}
              {loadingTags === tag?.label && <Icon.LoadingSpin size="16" />}
            </div>
          </PostUtil.Tag>
        );
      })}
    </div>
  );
}
