import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Card, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { UserView } from '@/types/User';
import { searchUsersByUsername } from '@/services/streamService';
import { getUserProfile } from '@/services/userService';
import { getHotTags } from '@/services/tagService';

interface SearchInputCardProps extends React.HTMLAttributes<HTMLDivElement> {
  refCard?: React.RefObject<HTMLDivElement>;
  inputValue?: string;
  isOpenCard?: boolean;
}

export default function SearchInputCard({ refCard, inputValue, isOpenCard, ...rest }: SearchInputCardProps) {
  const router = useRouter();
  const { pubky, searchTags, setSearchTags } = usePubkyClientContext();
  const [hotTags, setHotTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<any[]>(() => {
    const storedHistory = Utils.storage.get('searchHistory') as any;
    return storedHistory ? storedHistory : [];
  });
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserView>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMouseInside, setIsMouseInside] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!inputValue?.trim()) {
      setSearchedUsers([]);
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await searchUsersByUsername(inputValue.trim(), pubky);
        if (currentRequestId === requestIdRef.current) {
          setSearchedUsers(response || []);
        }
      } catch (error) {
        if (currentRequestId === requestIdRef.current) {
          setSearchedUsers([]);
        }
        console.error('Error searching users:', error);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, pubky]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMouseInside || searchedUsers.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => {
        const nextIndex =
          e.key === 'ArrowDown'
            ? prevIndex === null || prevIndex === searchedUsers.length - 1
              ? 0
              : prevIndex + 1
            : prevIndex === null || prevIndex === 0
              ? searchedUsers.length - 1
              : prevIndex - 1;

        document.getElementById(`user-${nextIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return nextIndex;
      });
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      const selectedUser = searchedUsers[selectedIndex];
      if (selectedUser) router.push(`/profile/${selectedUser.details.id}`);
    }
  };

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

    router.push(`/profile/${user.details.id}`);
  };

  useEffect(() => {
    const userIds = searchHistory.filter((item: any) => item.type === 'user').map((item: any) => item.value);

    if (userIds.length > 0) {
      const fetchProfiles = async () => {
        const profilesData: Record<string, UserView> = {};
        for (const userId of userIds) {
          try {
            const profileUser = await getUserProfile(userId, pubky ?? '');
            profilesData[userId] = profileUser;
          } catch (error) {
            console.error(`Failed to fetch profile for ${userId}`, error);
          }
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

  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge('outline-none absolute top-12 rounded-b-2xl rounded-t-none p-6 pt-2', rest.className)}
      background="bg-gradient-to-b from-[#05050A] to-transparent backdrop-blur-[25px] shadow-[0px_50px_100px_rgba(0,0,0,1)] border border-t-0 border-white border-opacity-20 z-20"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      onMouseEnter={(e) => {
        setIsMouseInside(true);
        e.currentTarget.focus();
      }}
      onMouseLeave={() => setIsMouseInside(false)}
    >
      {inputValue && searchedUsers.length > 0 ? (
        <div className="overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit flex flex-col">
          <Link
            href={`/search?tags=${inputValue}`}
            className="cursor-pointer opacity-80 hover:opacity-100 rounded flex items-center gap-2 mb-2"
          >
            <Icon.MagnifyingGlass size="20" />
            <Typography.Body variant="medium">Search &apos;{inputValue}&apos; as tag</Typography.Body>
          </Link>
          {searchedUsers.map((user, index) => (
            <SideCard.User
              key={user.details.id}
              id={`user-${index}`}
              uri={user.details.id}
              username={Utils.minifyText(user.details.name, 20)}
              label={Utils.minifyPubky(user.details.id)}
              className={`p-2 rounded-2xl ${selectedIndex === index ? 'bg-white/10' : 'hover:bg-white/10'}`}
              onMouseEnter={() => setSelectedIndex(index)}
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
                <div className="flex flex-wrap gap-4 justify-start items-start">
                  {searchHistory.slice(0, 5).map((item: any, index: number) => {
                    if (item.type === 'user') {
                      const profileUser = userProfiles[item.value];

                      return (
                        <div key={index}>
                          <SideCard.UserSmall
                            id={`user-${index}`}
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
                          {item.value}
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
