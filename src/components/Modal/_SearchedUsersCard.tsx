import { useState, useEffect, useRef } from 'react';
import { Typography, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';
import { UserView } from '@/types/User';
import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { twMerge } from 'tailwind-merge';

interface SearchedUsersCardProps {
  searchedUsers: UserView[];
  handleUserClick: (userId: string) => void;
  className?: string;
}

export default function SearchedUsersCard({ searchedUsers, handleUserClick, className }: SearchedUsersCardProps) {
  const { pubky } = usePubkyClientContext();
  const [userProfiles, setUserProfiles] = useState<UserView[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const baseCSS =
    'outline-none md:w-[300px] max-w-[300px] z-50 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit rounded-2xl border border-white border-opacity-30 flex flex-col absolute bg-gradient-to-t p-2 from-[#07040a] to-[#1b1820]';

  useEffect(() => {
    async function fetchProfiles() {
      if (searchedUsers.length > 0) {
        setIsLoading(true);
        const profiles = await Promise.all(searchedUsers.map((user) => getUserProfile(user?.details?.id, pubky ?? '')));
        setUserProfiles(profiles);
        setIsLoading(false);
      } else {
        setUserProfiles([]);
      }
    }

    fetchProfiles();
  }, [searchedUsers, pubky]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (searchedUsers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex = prevIndex === null || prevIndex === userProfiles.length - 1 ? 0 : prevIndex + 1;
        scrollToItem(newIndex);
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const newIndex = prevIndex === null || prevIndex === 0 ? userProfiles.length - 1 : prevIndex - 1;
        scrollToItem(newIndex);
        return newIndex;
      });
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      const selectedUser = searchedUsers[selectedIndex];
      if (selectedUser) handleUserClick(selectedUser.details.id);
    }
  };

  const scrollToItem = (index: number) => {
    const item = itemRefs.current[index];
    if (item && cardRef.current) {
      const card = cardRef.current;
      const itemTop = item.offsetTop;
      const itemBottom = item.offsetTop + item.offsetHeight;
      const cardScrollTop = card.scrollTop;
      const cardHeight = card.offsetHeight;

      if (itemTop < cardScrollTop) {
        card.scrollTop = itemTop;
      } else if (itemBottom > cardScrollTop + cardHeight) {
        card.scrollTop = itemBottom - cardHeight;
      }
    }
  };

  return (
    <div
      id="searched-users-card"
      ref={cardRef}
      className={twMerge(baseCSS, className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => cardRef?.current?.focus()}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Icon.LoadingSpin size="24" className="animate-spin" />
        </div>
      ) : (
        userProfiles.length > 0 &&
        userProfiles.map((data, index) => {
          const user = searchedUsers[index];
          const isSelected = selectedIndex === index;

          return (
            <div
              ref={(el) => {
                if (el) {
                  itemRefs.current[index] = el;
                }
              }}
              onClick={() => handleUserClick(user?.details?.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`cursor-pointer flex gap-2 p-2 rounded-2xl ${isSelected ? 'bg-white/10' : 'hover:bg-white/10'}`}
              key={`${index}-${user?.details?.id}`}
            >
              <ImageByUri
                id={data?.details?.id}
                isCensored={Utils.isProfileCensored(data)}
                width={40}
                height={40}
                className="rounded-full max-w-none h-none"
                style={{ width: `${40}px`, height: `${40}px` }}
                alt={'user'}
              />
              <div className="flex-col justify-start items-start inline-flex">
                <Typography.Body variant="medium-bold">
                  {data?.details?.name && Utils.minifyText(data?.details?.name, 20)}
                </Typography.Body>
                <Typography.Label className="text-opacity-30 -mt-1">
                  {Utils.minifyPubky(user?.details?.id)}
                </Typography.Label>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
