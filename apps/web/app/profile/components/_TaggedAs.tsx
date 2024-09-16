import { Skeleton } from '@/components';
import { ImageByUri } from '@/components/ImageByUri';
import { useUserProfile } from '@/hooks/useUser';
import { useClientContext } from '@/contexts';
import { UserTags, UserView } from '@/types/User';
import {
  Button,
  Icon,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';

type TaggedAsProps = {
  profile: UserView | null;
  creatorPubky: string | undefined;
  loading: boolean;
};

export default function TaggedAs({
  profile,
  creatorPubky,
  loading,
}: TaggedAsProps) {
  const router = useRouter();
  // const { pubky, deleteTag, createTag } = useClientContext();
  const pubky = 'pxnu33x7jtpx9ar1ytsi4yxbp6a5o36gwhffs8zoxmbuptici1jy';
  const usePubky = creatorPubky ?? pubky;
  const { data } = useUserProfile(usePubky);
  const name = data?.details?.name;
  //const image = data?.details?.image;
  const profileTags = data?.tags;
  //const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  //const [selectedTag, setSelectedTag] = useState<ITaggedProfile | null>(null);

  {
    /** 
  const handleAddProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await createTag(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTag(pubKeyToUse, tag);
    }
  };
  */
  }

  return (
    <div className="w-full">
      <SideCard.Header title={`${name} was tagged as:`} />
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <div className="mt-4 justify-start items-start gap-2 flex flex-col">
          {profileTags && profileTags.length > 0 ? (
            <>
              {profileTags.map((tag, index) => {
                const isTagFound = tag?.tagged?.some(
                  (fromItem) => fromItem?.tagger_id === pubky
                );

                const images = tag?.tagged?.map(
                  (fromItem) => fromItem?.tagger_id?.image
                );
                const displayedImages = images?.slice(0, 15);
                const extraImagesCount = images?.length - displayedImages?.length;

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
                      //onClick={(event) => {
                      //  event.stopPropagation();
                      //  isTagFound
                      //   ? handleDeleteProfileTag(tag.tag)
                      //   : handleAddProfileTag(tag.tag);
                      //}}
                      color={
                        tag?.label && Utils.generateRandomColor(tag?.label)
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tag?.label.replace(' ', ''), 20)}
                        <Typography.Caption
                          variant="bold"
                          className="text-opacity-30"
                        >
                          {tag?.tagged?.length}
                        </Typography.Caption>
                      </div>
                    </PostUtil.Tag>
                    {/**</div></TooltipUI.Root>*/}
                    <Button.Action
                      variant="custom"
                      size="small"
                      icon={<Icon.MagnifyingGlassLeft size="14" />}
                      onClick={() => router.push(`/search?tags=${tag?.label}`)}
                      className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                    />
                    <div
                      //onClick={() => setShowModalProfileTag(true)}
                      className="cursor-pointer flex items-center"
                    >
                      {displayedImages?.map((image, imageIndex) => (
                        <ImageByUri
                          width={32}
                          height={32}
                          key={`${tag?.label}-${imageIndex}`}
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
          {/**<Button.Medium
            className="mt-2 w-auto h-8 inline-flex items-center"
            onClick={() => setShowModalProfileTag(true)}
            icon={<Icon.Tag size="16" />}
          >
            Tag{' '}
            {!creatorPubky || creatorPubky === pubky
              ? 'yourself'
              : name && Utils.minifyText(name, 22)}
          </Button.Medium>*/}
        </div>
      )}
      {/**
      <Modal.ProfileTag
        profileTags={profileTags ?? []}
        showModalProfileTag={showModalProfileTag}
        setShowModalProfileTag={setShowModalProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={creatorPubky}
        name={name}
        uriImage={image}
      />
       */}
    </div>
  );
}
