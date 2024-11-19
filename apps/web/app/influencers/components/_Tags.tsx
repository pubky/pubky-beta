import { PostUtil, Typography } from '@social/ui-shared';
import { UserView } from '@/types/User';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';

interface TagsProps {
  influencer: UserView | undefined;
}

export function Tags({ influencer }: TagsProps) {
  const { pubky, createTagProfile, deleteTagProfile } = usePubkyClientContext();

  const handleAddProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await createTagProfile(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (creatorPubky: string, tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTagProfile(pubKeyToUse, tag);
    }
  };
  return (
    <div className="flex lg:justify-end gap-2 items-center lg:w-full">
      {influencer?.tags?.slice(0, 3).map((tag, index) => {
        const isTagFound = tag?.taggers?.some((fromItem) => fromItem === pubky);

        return (
          <PostUtil.Tag
            key={index}
            clicked={false}
            onClick={(event) => {
              event.stopPropagation();
              isTagFound
                ? handleDeleteProfileTag(influencer?.details?.id, tag?.label)
                : handleAddProfileTag(influencer?.details?.id, tag?.label);
            }}
            color={tag?.label && Utils.generateRandomColor(tag?.label)}
          >
            <div className="flex gap-2 items-center">
              {Utils.minifyText(tag?.label, 10)}
              <Typography.Caption variant="bold" className="text-opacity-60">
                {tag?.taggers_count}
              </Typography.Caption>
            </div>
          </PostUtil.Tag>
        );
      })}
    </div>
  );
}
