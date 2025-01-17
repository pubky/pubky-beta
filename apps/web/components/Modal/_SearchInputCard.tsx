import { useRouter } from 'next/navigation';
import { Card, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { useHotTags } from '@/hooks/useTag';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UserView } from '@/types/User';
import { searchUsersByUsername } from '@/services/streamService';

interface SearchInputCardProps extends React.HTMLAttributes<HTMLDivElement> {
  refCard?: React.RefObject<HTMLDivElement>;
  inputValue?: string;
}

export default function SearchInputCard({
  refCard,
  inputValue,
  ...rest
}: SearchInputCardProps) {
  const router = useRouter();
  const { pubky, searchTags, setSearchTags } = usePubkyClientContext();
  const { data: hotTags, isLoading } = useHotTags(0, 10);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMouseInside, setIsMouseInside] = useState(false);

  const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    router.push('/search');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMouseInside || searchedUsers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === null || prevIndex === searchedUsers.length - 1
          ? 0
          : prevIndex + 1,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex === null || prevIndex === 0
          ? searchedUsers.length - 1
          : prevIndex - 1,
      );
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      const selectedUser = searchedUsers[selectedIndex];
      if (selectedUser) {
        router.push(`/profile/${selectedUser.details.id}`);
      }
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(async () => {
      if (inputValue && inputValue.trim() !== '') {
        const response = await searchUsersByUsername(inputValue.trim(), pubky);
        setSearchedUsers(response || []);
      } else {
        setSearchedUsers([]);
      }
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [inputValue, pubky]);

  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge(
        'outline-none absolute top-12 rounded-b-2xl rounded-t-none p-6 pt-2',
        rest.className,
      )}
      background="bg-[#05050A] border border-t-0 border-white border-opacity-20 z-10"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => {
        setIsMouseInside(true);
        refCard?.current?.focus();
      }}
      onMouseLeave={() => setIsMouseInside(false)}
    >
      {inputValue !== '' && searchedUsers && searchedUsers.length > 0 ? (
        <div className="overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit flex flex-col">
          <Link
            href={`/search?tags=${inputValue}`}
            className="cursor-pointer opacity-80 hover:opacity-100 rounded flex items-center gap-2 mb-2"
          >
            <Icon.MagnifyingGlass size="20" />
            <Typography.Body variant="medium">
              Search &apos;{inputValue}&apos; as tag
            </Typography.Body>
          </Link>
          {searchedUsers.map((user, index) => (
            <SideCard.User
              key={user.details.id}
              uri={user.details.id}
              uriImage={user?.details?.image || '/images/webp/Userpic.webp'}
              username={Utils.minifyText(user?.details?.name, 20)}
              label={Utils.minifyPubky(user?.details?.id)}
              className={`p-2 rounded-2xl ${
                selectedIndex === index ? 'bg-white/10' : 'hover:bg-white/10'
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-col gap-6 inline-flex">
          <div>
            {isLoading ? (
              <Typography.Body variant="small" className="text-opacity-30">
                Loading...
              </Typography.Body>
            ) : hotTags && hotTags.length > 0 ? (
              <>
                <Typography.Label className="text-opacity-30">
                  Hot tags
                </Typography.Label>
                <div className="mt-2 justify-start items-start">
                  {hotTags.slice(0, 10).map((tag, index) => (
                    <PostUtil.Tag
                      key={index}
                      clicked={false}
                      onClick={() => handleTagSearch(tag.label)}
                      color={tag.label && Utils.generateRandomColor(tag.label)}
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
        </div>
      )}
    </Card.Primary>
  );
}
