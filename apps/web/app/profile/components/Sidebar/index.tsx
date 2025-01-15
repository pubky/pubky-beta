'use client';

import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';
import { Modal } from '@/components/Modal';
import UserInfo from './_UserInfo';
import BioSection from './_BioSection';
import TaggedSection from './_TaggedSection';
import LinksSection from './_LinksSection';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import { BottomSheet } from '@/components';

export default function Sidebar({
  creatorPubky,
}: {
  creatorPubky?: string | null;
}) {
  const { pubky, profile, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const usePubky = creatorPubky ?? pubky;
  const { data, isLoading } = useUserProfile(usePubky ?? '', pubky ?? '');
  //if (isError) console.error(isError);
  const profileUser = data;
  const name = profileUser?.details?.name ?? '';
  const bio = profileUser?.details.bio || 'No bio.';
  const links = profile?.links || profileUser?.details?.links;
  const image = profileUser?.details?.image ?? '/images/webp/Userpic.webp';
  const profileTags = profileUser?.tags ?? [];
  const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  //const [showTooltipProfile, setShowTooltipProfile] = useState('');
  //const [loadingProfileTags, setLoadingProfileTags] = useState(true);
  //const [pubkyUser, setPubkyUser] = useState('');
  //const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<UserTags | null>(null);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [showSheetCheckLink, setShowSheetCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const checkLink = Utils.storage.get('checkLink') as boolean;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (profile) {
          //setInitLoadingFollowed(false);
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

    if (pubKeyToUse) {
      await createTagProfile(pubKeyToUse, tag);
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTagProfile(pubKeyToUse, tag);
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
          pubkyUser={usePubky ?? ''}
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
        pubkyUser={usePubky}
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
