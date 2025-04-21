'use client';

import { useEffect, useState } from 'react';
import UserInfo from './_UserInfo';
import TaggedSection from './_TaggedSection';
import LinksSection from './_LinksSection';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import { Feedback } from '@/components';

export default function Sidebar({ creatorPubky, activeTab }: { creatorPubky?: string | null; activeTab: number }) {
  const { pubky, profile } = usePubkyClientContext();
  const userPubky = creatorPubky ?? pubky;
  const { data: profileUser, isLoading } = useUserProfile(userPubky ?? '', pubky ?? '');
  const name = creatorPubky ? profileUser?.details?.name || '' : profile?.name || '';
  const bio = creatorPubky ? profileUser?.details?.bio || 'No bio.' : profile?.bio || 'No bio.';
  const links = creatorPubky ? profileUser?.details?.links : profile?.links;
  const [profileTags, setProfileTags] = useState<UserTags[]>(profileUser?.tags ?? []);
  const [followed, setFollowed] = useState(false);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <div className="w-[180px] hidden flex-col justify-start items-start gap-8 xl:inline-flex">
      <UserInfo
        scrolled={scrolled}
        name={name}
        profile={profileUser}
        creatorPubky={creatorPubky}
        pubkyUser={userPubky}
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
        {/**<BioSection id="profile-bio-content" loading={isLoading} bio={bio} />*/}
        {activeTab !== 6 && (
          <TaggedSection
            profileTags={profileTags}
            setProfileTags={setProfileTags}
            loadingProfileTags={isLoading}
            creatorPubky={creatorPubky}
            name={name}
            userPubky={userPubky ?? ''}
            user={profileUser}
          />
        )}

        <LinksSection links={links || []} />
        <Feedback />
      </div>
    </div>
  );
}
