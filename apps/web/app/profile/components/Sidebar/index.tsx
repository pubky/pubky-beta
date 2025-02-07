'use client';

import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';
import { Modal } from '@/components/Modal';
import UserInfo from './_UserInfo';
import BioSection from './_BioSection';
import TaggedSection from './_TaggedSection';
import LinksSection from './_LinksSection';
import { useUserProfile } from '@/hooks/useUser';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import { BottomSheet } from '@/components';

export default function Sidebar({
  creatorPubky,
}: {
  creatorPubky?: string | null;
}) {
  const { addAlert } = useAlertContext();
  const { pubky, profile, createTagProfile, deleteTagProfile } =
    usePubkyClientContext();
  const userPubky = creatorPubky ?? pubky;
  const { data: profileUser, isLoading } = useUserProfile(
    userPubky ?? '',
    pubky ?? '',
  );
  const name = creatorPubky
    ? (profileUser?.details?.name ?? '')
    : (profile?.name ?? '');
  const bio = creatorPubky
    ? (profileUser?.details?.bio ?? '')
    : (profile?.bio ?? 'No bio.');
  const links = creatorPubky ? profileUser?.details?.links : profile?.links;
  const image = profileUser?.details?.image ?? '/images/webp/Userpic.webp';
  const [profileTags, setProfileTags] = useState<UserTags[]>(
    profileUser?.tags ?? [],
  );
  const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<UserTags | null>(null);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [showSheetCheckLink, setShowSheetCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const checkLink = Utils.storage.get('checkLink') as boolean;
  const [scrolled, setScrolled] = useState(false);
  const [loadingTags, setLoadingTags] = useState('');

  useEffect(() => {
    setProfileTags(profileUser?.tags ?? []);
  }, [profileUser?.tags]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (profileUser) {
          if (profileUser?.relationship?.following) setFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser, creatorPubky]);

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
        // update tag optimistic in the UI
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
              }
            : t,
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1400) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="w-[180px] hidden flex-col justify-start items-start gap-8 xl:inline-flex">
        <UserInfo
          scrolled={scrolled}
          uriImage={image}
          name={name}
          profile={profileUser}
          creatorPubky={creatorPubky}
          pubkyUser={userPubky ?? ''}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          bio={bio}
          initLoadingFollowed={isLoading}
          followed={followed}
          setFollowed={setFollowed}
          loadingFollowed={loadingFollowed}
          setLoadingFollowed={setLoadingFollowed}
        />
        <div className="w-full flex-col justify-start items-start gap-8 xl:inline-flex lg:ml-3">
          <BioSection id="profile-bio-content" loading={isLoading} bio={bio} />
          <TaggedSection
            profileTags={profileTags}
            loadingProfileTags={isLoading}
            handleAddProfileTag={handleAddProfileTag}
            handleDeleteProfileTag={handleDeleteProfileTag}
            setShowModalProfileTag={setShowModalProfileTag}
            creatorPubky={creatorPubky}
            name={name}
            loadingTags={loadingTags}
          />

          <LinksSection
            links={links || []}
            checkLink={checkLink}
            setShowModalCheckLink={setShowModalCheckLink}
            setShowSheetCheckLink={setShowSheetCheckLink}
            setClickedLink={setClickedLink}
          />
        </div>
      </div>
      <Modal.CheckLink
        showModalCheckLink={showModalCheckLink}
        setShowModalCheckLink={setShowModalCheckLink}
        clickedLink={clickedLink}
      />
      <Modal.ProfileTag
        profileTags={profileTags}
        showModalProfileTag={showModalProfileTag}
        setShowModalProfileTag={setShowModalProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={userPubky}
        user={profileUser}
      />
      <BottomSheet.CheckLink
        show={showSheetCheckLink}
        setShow={setShowSheetCheckLink}
        clickedLink={clickedLink}
      />
    </>
  );
}
