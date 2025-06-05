import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Card, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { UserView } from '@/types/User';
import { getUserProfile } from '@/services/userService';
import { getHotTags } from '@/services/tagService';

interface SearchInputCardProps extends React.HTMLAttributes<HTMLDivElement> {
  refCard?: React.RefObject<HTMLDivElement>;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  isOpenCard?: boolean;
  searchedUsers: UserView[];
  searchedTags?: string[];
  selectedUserIndex: number | null;
  setSelectedUserIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onUserClick: (user: UserView) => void;
}

export default function SearchInputCard({
  refCard,
  inputValue,
  setInputValue,
  isOpenCard,
  searchedUsers,
  searchedTags = [],
  selectedUserIndex,
  setSelectedUserIndex,
  onUserClick,
  ...rest
}: SearchInputCardProps) {
  const router = useRouter();
  const { pubky, searchTags, setSearchTags } = usePubkyClientContext();
  const [hotTags, setHotTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<any[]>(() => {
    const storedHistory = Utils.storage.get('searchHistory') as any;
    return storedHistory ? storedHistory : [];
  });
  const [userProfiles, setUserProfiles] = useState<Record<string, UserView>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  async function fetchHotTags() {
    try {
      setIsLoading(true);
      const data = await getHotTags(pubky, undefined, 0, 10);
      setHotTags(data || []);
    } catch (error) {
      console.error('Error fetching hot tags:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isOpenCard) return;
    fetchHotTags();
  }, [isOpenCard]);

  const handleTagSearch = (tag: string) => {
    if (!searchTags.includes(tag)) {
      setSearchTags(searchTags.length < 3 ? [...searchTags, tag] : [...searchTags.slice(1), tag]);
      const updatedHistory = [
        { type: 'tag', value: tag },
        ...searchHistory.filter((item: any) => item.value !== tag)
      ].slice(0, 5);
      Utils.storage.set('searchHistory', JSON.stringify(updatedHistory));
      router.push('/search');
    }
    if (setInputValue) setInputValue('');
  };

  const handleUserClick = (user: UserView) => {
    const userEntry = {
      type: 'user',
      value: user.details.id
    };
    const updatedHistory = [userEntry, ...searchHistory.filter((item: any) => item.value !== user.details.id)].slice(
      0,
      5
    );
    Utils.storage.set('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
    onUserClick(user);
  };

  useEffect(() => {
    const userIds = searchHistory.filter((item: any) => item.type === 'user').map((item: any) => item.value);
    if (userIds.length > 0) {
      const fetchProfiles = async () => {
        const profilesData: Record<string, UserView> = {};
        const validUserIds: string[] = [];
        for (const userId of userIds) {
          try {
            const profileUser = await getUserProfile(userId, pubky ?? '');
            if (profileUser) {
              profilesData[userId] = profileUser;
              validUserIds.push(userId);
            }
          } catch (error) {
            console.error(`Failed to fetch profile for ${userId}`, error);
          }
        }
        // Remove non-existent users from search history
        const updatedHistory = searchHistory.filter(
          (item: any) => item.type !== 'user' || validUserIds.includes(item.value)
        );
        if (updatedHistory.length !== searchHistory.length) {
          Utils.storage.set('searchHistory', JSON.stringify(updatedHistory));
          setSearchHistory(updatedHistory);
        }
        setUserProfiles(profilesData);
      };
      fetchProfiles();
    }
  }, [searchHistory]);

  const clearHistory = () => {
    Utils.storage.remove('searchHistory');
    setSearchHistory([]);
  };

  // Add new useEffect for scrolling
  useEffect(() => {
    if (selectedUserIndex !== null && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.children[selectedUserIndex + 1]; // +1 because of the search tag link
      if (selectedElement) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();

        // Check if element is outside the visible area
        if (elementRect.bottom > containerRect.bottom) {
          scrollContainerRef.current.scrollTop += elementRect.bottom - containerRect.bottom;
        } else if (elementRect.top < containerRect.top) {
          scrollContainerRef.current.scrollTop -= containerRect.top - elementRect.top;
        }
      }
    }
  }, [selectedUserIndex]);

  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge('outline-none absolute top-12 rounded-b-2xl rounded-t-none p-6 pt-2', rest.className)}
      background="bg-gradient-to-b from-[#05050A] to-transparent backdrop-blur-[25px] shadow-[0px_50px_100px_rgba(0,0,0,1)] border border-t-0 border-white border-opacity-20 z-20"
    >
      {inputValue && (searchedTags.length > 0 || searchedUsers.length > 0) ? (
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit flex flex-col"
        >
          <Link
            href={`/search?tags=${inputValue}`}
            className="cursor-pointer opacity-80 hover:opacity-100 rounded flex items-center gap-2 mb-2"
          >
            <Icon.MagnifyingGlass size="20" />
            <Typography.Body variant="medium">Search &apos;{inputValue}&apos; as tag</Typography.Body>
          </Link>
          {searchedTags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {searchedTags.map((tag, idx) => (
                <PostUtil.Tag
                  key={tag}
                  clicked={false}
                  onClick={() => handleTagSearch(tag)}
                  color={Utils.generateRandomColor(tag)}
                  className="my-1 cursor-pointer"
                  boxShadow={false}
                >
                  {Utils.truncateTag(tag, 20)}
                </PostUtil.Tag>
              ))}
            </div>
          )}
          {searchedUsers.map((user, index) => (
            <SideCard.User
              key={user.details.id}
              isCensored={Utils.isProfileCensored(user)}
              id={`user-${index}`}
              uri={user.details.id}
              username={Utils.minifyText(user.details.name, 20)}
              label={Utils.minifyPubky(user.details.id)}
              className={`p-2 rounded-2xl ${selectedUserIndex === index ? 'bg-white/10' : 'hover:bg-white/10'}`}
              onMouseEnter={() => setSelectedUserIndex(index)}
              onClick={() => handleUserClick(user)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-col inline-flex">
          {searchHistory && searchHistory.length > 0 && (
            <div className="mb-2">
              <Typography.Label className="flex gap-2 items-center text-opacity-30">
                Recent Searches{' '}
                <span onClick={clearHistory} className="cursor-pointer opacity-30 hover:opacity-80">
                  <Icon.X gap-12 />
                </span>
              </Typography.Label>
              <div className="mt-2 flex flex-col">
                <div className="flex flex-wrap gap-2 justify-start items-start">
                  {searchHistory.slice(0, 5).map((item: any, index: number) => {
                    if (item.type === 'user') {
                      const profileUser = userProfiles[item.value];
                      return (
                        <div key={index}>
                          <SideCard.UserSmall
                            id={`user-${index}`}
                            isCensored={Utils.isProfileCensored(profileUser)}
                            uri={item.value}
                            username={Utils.minifyText(profileUser?.details?.name, 20)}
                            label={Utils.minifyPubky(profileUser?.details?.id)}
                            onClick={() => handleUserClick(profileUser)}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="flex flex-wrap gap-2 justify-start items-start">
                  {searchHistory.slice(0, 5).map((item: any, index: number) => {
                    if (item.type === 'tag') {
                      return (
                        <PostUtil.Tag
                          key={index}
                          clicked={false}
                          onClick={() => handleTagSearch(item.value)}
                          color={Utils.generateRandomColor(item.value)}
                          className="my-1"
                          boxShadow={false}
                        >
                          {Utils.truncateTag(item.value, 20)}
                        </PostUtil.Tag>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          )}
          {isLoading ? (
            <Typography.Body variant="small" className="text-opacity-30">
              Loading...
            </Typography.Body>
          ) : hotTags && hotTags?.length > 0 ? (
            <>
              <Typography.Label className="text-opacity-30">Hot Tags</Typography.Label>
              <div className="mt-2 justify-start items-start">
                {hotTags.slice(0, 10).map((tag, index) => (
                  <PostUtil.Tag
                    key={index}
                    clicked={false}
                    onClick={() => handleTagSearch(tag.label)}
                    color={Utils.generateRandomColor(tag.label)}
                    className="mr-2 my-1"
                    boxShadow={false}
                  >
                    {tag.label}
                  </PostUtil.Tag>
                ))}
              </div>
            </>
          ) : (
            <Typography.Body variant="small" className="text-opacity-30">
              No tags yet
            </Typography.Body>
          )}
        </div>
      )}
    </Card.Primary>
  );
}
