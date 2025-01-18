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
  const { data, isLoading } = useUserProfile(userPubky ?? '', pubky ?? '');
  const profileUser = data;
  const name = profileUser?.details?.name ?? '';
  const bio = profileUser?.details.bio || 'No bio.';
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
        if (profile) {
          if (profileUser?.relationship?.following) setFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, creatorPubky]);

  const handleAddProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

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

  const handleDeleteProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    // loading tag
    setLoadingTags(tag);

    if (pubKeyToUse) {
      // check if tag exists in profileTags
      const tagExists = profileTags.find((t) => t.label === tag);
      if (tagExists) {
        // check if pubkeyToUse is in taggers
        if (tagExists.taggers.includes(pubKeyToUse)) {
          // remove tagger from tag but keep the tag but update the taggers_count
          tagExists.taggers_count--;
          tagExists.taggers = tagExists.taggers.filter(
            (t) => t !== pubKeyToUse,
          );
          setProfileTags(
            profileTags.map((t) => (t.label === tag ? tagExists : t)),
          );
        } else {
          // remove tag from taggers
          tagExists.taggers_count--;
          tagExists.taggers = tagExists.taggers.filter(
            (t) => t !== pubKeyToUse,
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
        name={name}
        uriImage={image}
      />
      <BottomSheet.CheckLink
        show={showSheetCheckLink}
        setShow={setShowSheetCheckLink}
        clickedLink={clickedLink}
      />
    </>
  );
}
