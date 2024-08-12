import { Skeleton } from '@/components';
import { ImageByUri } from '@/components/ImageByUri';
import { useClientContext } from '@/contexts';
import { ITaggedProfile } from '@/types';
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
  profileTags: ITaggedProfile[];
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
  const { pubky } = useClientContext();
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
                const isTagFound = tag.from.some(
                  (fromItem) => fromItem.author.id === pubky
                );

                const images = tag.from.map(
                  (fromItem) => fromItem.author.profile.image
                );
                const displayedImages = images.slice(0, 4);
                const extraImagesCount = images.length - displayedImages.length;

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
                          ? handleDeleteProfileTag(tag.tag)
                          : handleAddProfileTag(tag.tag);
                      }}
                      color={tag.tag && Utils.generateRandomColor(tag.tag)}
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag.tag.replace(' ', ''), 20)}
                        <Typography.Caption
                          variant="bold"
                          className="text-opacity-30"
                        >
                          {tag.count}
                        </Typography.Caption>
                      </div>
                    </PostUtil.Tag>
                    {/**</div></TooltipUI.Root>*/}
                    <Button.Action
                      variant="custom"
                      size="small"
                      icon={<Icon.MagnifyingGlassLeft size="14" />}
                      onClick={() => router.push(`/search?tags=${tag.tag}`)}
                      className="cursor-pointer text-fuchsia-500 text-opacity-50 hover:text-opacity-80"
                    />
                    <div
                      onClick={() => setShowModalProfileTag(true)}
                      className="cursor-pointer flex items-center"
                    >
                      {displayedImages.map((image, imageIndex) => (
                        <ImageByUri
                          width={32}
                          height={32}
                          key={`${tag.tag}-${imageIndex}`}
                          className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                            imageIndex > 0 && '-ml-2'
                          }`}
                          alt={`tag-${imageIndex + 1}`}
                          uri={image}
                        />
                      ))}
                      {extraImagesCount > 0 && (
                        <PostUtil.Counter className="-ml-2">
                          +{extraImagesCount}
                        </PostUtil.Counter>
                      )}
                    </div>
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
