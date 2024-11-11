'use client';

import { useEffect, useState } from 'react';
import { Utils } from '@social/utils-shared';
import { Modal } from '@/components/Modal';
import UserInfo from './_UserInfo';
import BioSection from './_BioSection';
import TaggedSection from './_TaggedSection';
import LinksSection from './_LinksSection';
import { useUserProfile, useUserStream } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';

export default function Sidebar({
  creatorPubky,
}: {
  creatorPubky?: string | null;
}) {
  const { pubky, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const usePubky = creatorPubky ?? pubky;
  const { data, isLoading, isError } = useUserProfile(
    usePubky ?? '',
    pubky ?? ''
  );
  if (isError) console.error(isError);
  const profile = data;
  const { data: initFollowers } = useUserStream(
    usePubky ?? '',
    pubky,
    0,
    10,
    'followers'
  );
  const name = profile?.details?.name ?? '';
  const bio = profile?.details.bio || 'No bio.';
  const links = profile?.details?.links ?? [];
  const image = profile?.details?.image ?? '/images/webp/Userpic.webp';
  const profileTags = profile?.tags ?? [];
  const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  //const [showTooltipProfile, setShowTooltipProfile] = useState('');
  //const [loadingProfileTags, setLoadingProfileTags] = useState(true);
  //const [pubkyUser, setPubkyUser] = useState('');
  //const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<UserTags | null>(null);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const checkLink = Utils.storage.get('checkLink') as boolean;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey = creatorPubky;

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followersList = initFollowers;

        if (followersList) {
          //setInitLoadingFollowed(false);

          followersList.forEach((user) => {
            const uri = user?.details?.id.replace('pubky:', '');
            if (uri === pubky) {
              setFollowed(true);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followed, creatorPubky]);

  {
    /**

  async function fetchProfile() {
    try {
      let profile = null;
      if (creatorPubky) {
        const userProfile = await getUser(creatorPubky);

        if (userProfile) {
          profile = userProfile?.profile;
          setPubkyUser(creatorPubky);
          setProfileTags(userProfile?.taggedAs);
        }
      } else {
        if (!pubky) return;
        const userProfile = await getUser(pubky);
        setPubkyUser(pubky || '');

        if (userProfile) {
          profile = userProfile.profile;
          setProfileTags(userProfile?.taggedAs);
        }
      }

      if (profile) {
        setName(profile?.name || '');
        setBio(profile?.bio || 'No bio.');
        setImage(profile?.image || '/images/webp/Userpic.webp');
        setLinks(
          profile?.links.map((link) => ({ title: link.title, url: link.url }))
        );

        setLoading(false);
      }
      setLoadingProfileTags(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, getProfile, getUser, creatorPubky]);
  */
  }

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
      if (window.scrollY > 1100) {
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
      <div className="col-span-1 hidden flex-col justify-start items-start gap-8 xl:inline-flex">
        <UserInfo
          scrolled={scrolled}
          uriImage={image}
          name={name}
          profile={profile}
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
            links={links}
            checkLink={checkLink}
            setShowModalCheckLink={setShowModalCheckLink}
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
    </>
  );
}
