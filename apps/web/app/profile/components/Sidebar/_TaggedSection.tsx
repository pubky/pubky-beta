import { Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import {
  Button,
  Icon,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';

interface TaggedSectionProps {
  profileTags: UserTags[];
  loadingProfileTags: boolean;
  handleAddProfileTag: (tag: string) => void;
  handleDeleteProfileTag: (tag: string) => void;
  setShowModalProfileTag: (show: boolean) => void;
  creatorPubky: string | null | undefined;
  name: string;
}

export default function TaggedSection({
  profileTags,
  loadingProfileTags,
  handleAddProfileTag,
  handleDeleteProfileTag,
  setShowModalProfileTag,
  creatorPubky,
  name,
}: TaggedSectionProps) {
  const { pubky } = usePubkyClientContext();
  const router = useRouter();

  return (
    <div className="w-full">
      <SideCard.Header title="Tagged" />
      {loadingProfileTags ? (
        <Skeleton.Simple />
      ) : (
        <div className="mt-4 justify-start items-start gap-2 flex flex-col">
          {profileTags.length > 0 ? (
            <>
              {profileTags.map((tag, index) => {
                const isTagFound = tag?.taggers?.some(
                  (fromItem) => fromItem === pubky
                );

                return (
                  <div className="flex gap-2" key={index}>
                    {/**<TooltipUI.Root
                    delay={500}
                    setShowTooltip={setShowTooltipProfile}
                    tagId={tag.tag}
                  >
                    {showTooltipProfile === tag.tag && (
                      <Tooltip.Tag
                        setShowModalTags={setShowModalProfileTag}
                        setSelectedTag={setSelectedTag}
                        tags={tag}
                      />
                    )}*/}
                    <PostUtil.Tag
                      key={index}
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        isTagFound
                          ? handleDeleteProfileTag(tag?.label)
                          : handleAddProfileTag(tag?.label);
                      }}
                      color={
                        tag?.label && Utils.generateRandomColor(tag?.label)
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag?.label.replace(' ', ''), 20)}
                        {/**<Typography.Caption
                          variant="bold"
                          className="text-opacity-30"
                        >
                          {tag?.taggers_count}
                        </Typography.Caption>*/}
                      </div>
                    </PostUtil.Tag>
                    {/**</TooltipUI.Root>*/}
                    <Button.Action
                      variant="custom"
                      size="small"
                      icon={<Icon.MagnifyingGlassLeft size="14" />}
                      onClick={() => router.push(`/search?tags=${tag?.label}`)}
                      className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                    />
                    <PostUtil.Counter className="w-full">
                      {tag?.taggers_count}
                    </PostUtil.Counter>
                  </div>
                );
              })}
            </>
          ) : (
            <Typography.Body variant="small" className="text-opacity-50">
              No tags yet
            </Typography.Body>
          )}
          <Button.Medium
            className="mt-2 w-auto h-8 inline-flex items-center"
            onClick={() => setShowModalProfileTag(true)}
            icon={<Icon.Tag size="16" />}
          >
            Tag{' '}
            {!creatorPubky || creatorPubky === pubky
              ? 'yourself'
              : Utils.minifyText(name, 22)}
          </Button.Medium>
        </div>
      )}
    </div>
  );
}
