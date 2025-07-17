import { Skeleton } from '@/components';
import { useUtilsTag } from '@/app/profile/components/_UtilsTags';
import { useModal, usePubkyClientContext } from '@/contexts';
import { UserTags, UserView } from '@/types/User';
import { Button, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TaggedSectionProps {
  profileTags: UserTags[];
  setProfileTags: React.Dispatch<React.SetStateAction<UserTags[]>>;
  loadingProfileTags: boolean;
  creatorPubky: string | null | undefined;
  name: string;
  userPubky: string;
  user: UserView | null;
}

export default function TaggedSection({
  profileTags,
  setProfileTags,
  loadingProfileTags,
  creatorPubky,
  name,
  userPubky,
  user
}: TaggedSectionProps) {
  const { pubky } = usePubkyClientContext();
  const { openModal } = useModal();
  const router = useRouter();
  const { addProfileTag, deleteProfileTag, loadingTags } = useUtilsTag({
    profileTags,
    setProfileTags,
    pubkyUser: userPubky,
    user
  });

  return (
    <div id="profile-tagged-section" className="w-full">
      <SideCard.Header title="Tagged as" />
      {loadingProfileTags ? (
        <Skeleton.Simple />
      ) : (
        <div className="mt-4 justify-start items-start gap-2 flex flex-col">
          {profileTags.length > 0 ? (
            <>
              {profileTags.map((tag, index) => {
                const isTagFound = tag?.relationship || false;

                return (
                  <div className="flex gap-2" key={index}>
                    <PostUtil.Tag
                      key={index}
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        pubky
                          ? isTagFound
                            ? deleteProfileTag(tag?.label)
                            : addProfileTag(tag?.label)
                          : openModal('join');
                      }}
                      color={tag?.label && Utils.generateRandomColor(tag?.label)}
                    >
                      <div className="flex gap-2 items-center">{Utils.minifyText(tag?.label, 10)}</div>
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
                      {loadingTags === tag?.label ? <Icon.LoadingSpin size="12" /> : tag?.taggers_count}
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
            id="profile-tag-btn"
            className="whitespace-nowrap mt-2 w-auto h-8 inline-flex items-center"
            icon={<Icon.Tag size="16" />}
            onClick={() => {
              pubky
                ? router.push(creatorPubky ? `/profile/${creatorPubky}/tagged` : '/profile/tagged')
                : openModal('join');
            }}
          >
            Tag {!creatorPubky || creatorPubky === pubky ? 'yourself' : Utils.minifyText(name, 9)}
          </Button.Medium>
        </div>
      )}
    </div>
  );
}
