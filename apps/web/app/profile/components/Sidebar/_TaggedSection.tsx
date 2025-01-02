import { Skeleton } from '@/components';
import { useJoinModal, usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import {
  Button,
  Icon,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

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
  const { openJoinModal } = useJoinModal();

  return (
    <div className="w-full">
      <SideCard.Header title="Tagged as" />
      {loadingProfileTags ? (
        <Skeleton.Simple />
      ) : (
        <div className="mt-4 justify-start items-start gap-2 flex flex-col">
          {profileTags.length > 0 ? (
            <>
              {profileTags.map((tag, index) => {
                const isTagFound = tag?.taggers?.some(
                  (fromItem) => fromItem === pubky,
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
                        pubky
                          ? isTagFound
                            ? handleDeleteProfileTag(tag?.label)
                            : handleAddProfileTag(tag?.label)
                          : openJoinModal();
                      }}
                      color={
                        tag?.label && Utils.generateRandomColor(tag?.label)
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag?.label, 21)}
                        {/**<Typography.Caption
                          variant="bold"
                          className="text-opacity-30"
                        >
                          {tag?.taggers_count}
                        </Typography.Caption>*/}
                      </div>
                    </PostUtil.Tag>
                    {/**</TooltipUI.Root>*/}
                    <Link href={pubky ? `/search?tags=${tag?.label}` : ''}>
                      <Button.Action
                        variant="custom"
                        size="small"
                        icon={<Icon.MagnifyingGlassLeft size="14" />}
                        className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                      />
                    </Link>
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
            onClick={() =>
              pubky ? setShowModalProfileTag(true) : openJoinModal()
            }
            icon={<Icon.Tag size="16" />}
          >
            Tag{' '}
            {!creatorPubky || creatorPubky === pubky
              ? 'yourself'
              : Utils.minifyText(name, 9)}
          </Button.Medium>
        </div>
      )}
    </div>
  );
}
