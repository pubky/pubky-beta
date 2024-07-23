import { useRouter } from 'next/navigation';
import { Card, Icon, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { IUserProfile } from '@/types';

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
  const { hotTags, searchUsers } = useClientContext();
  const [searchedUsers, setSearchedUsers] = useState<IUserProfile[] | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotTags) {
      setLoading(false);
    }
  }, [hotTags]);

  useEffect(() => {
    if (inputValue) {
      SearchListUsers(inputValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const SearchListUsers = async (inputValue: string) => {
    const result = await searchUsers(inputValue);
    if (result) {
      setSearchedUsers(result);
    } else {
      setSearchedUsers([]);
    }
  };

  {
    /** const handleTagSearch = (tag: string) => {
    if (searchTags.includes(tag)) return;

    if (searchTags.length < 3) {
      setSearchTags([...searchTags, tag]);
    } else {
      const newSearchTags = [...searchTags.slice(1), tag];
      setSearchTags(newSearchTags);
    }
    router.push('/search');
  };*/
  }

  {
    /**  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = [...searchTags];
    newTags.splice(indexToRemove, 1);
    setSearchTags(newTags);
  };*/
  }

  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge('absolute top-16', rest.className)}
      background="bg-[#05050A] border border-white border-opacity-30"
    >
      {inputValue !== '' && searchedUsers && searchedUsers.length > 0 ? (
        <div className="overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-webkit flex flex-col gap-2">
          <div
            onClick={() => router.push(`/search?tags=${inputValue}`)}
            className="cursor-pointer hover:bg-white hover:bg-opacity-10 rounded flex items-center gap-2 mb-2"
          >
            <Icon.MagnifyingGlass size="20" />
            <Typography.Body variant="medium" className="text-opacity-80">
              Search &apos;{inputValue}&apos; as tag
            </Typography.Body>
          </div>
          {searchedUsers.map((user) => (
            <SideCard.User
              key={user.userId}
              uri={user.userId}
              src={user.profile?.image || '/images/Userpic.png'}
              username={Utils.minifyText(user.profile?.name)}
              label={Utils.minifyPubky(user.userId)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-col gap-6 inline-flex">
          {/**{searchTags.length > 0 && (
            <div>
              <Typography.Label className="text-opacity-30">
                Searched tags
              </Typography.Label>
              <div className="mt-2 justify-start items-start">
                {searchTags.map((searchTag, index) => (
                  <PostUtil.Tag
                    key={index}
                    clicked
                    action={
                      <div className="mt-[3px]">
                        <Icon.X key={index} />
                      </div>
                    }
                    onClick={() => handleRemoveTag(index)}
                    className="mr-2 my-1"
                  >
                    {searchTag}
                  </PostUtil.Tag>
                ))}
              </div>
            </div>
          )}*/}
          <div>
            {loading ? (
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
                      onClick={() => router.push(`/search?tags=${tag.tag}`)}
                      color={tag.tag && Utils.generateRandomColor(tag.tag)}
                      className="mr-2 my-1"
                    >
                      {tag.tag}
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
          {/**<div>
            <Typography.Label className="text-opacity-30 font-medium">
              Emotag
            </Typography.Label>
            <div className="mt-2 gap-2 inline-flex">
              <PostUtil.Tag clicked={false} color="red">
                🔥
              </PostUtil.Tag>
              <PostUtil.Tag clicked={false} color="cyan">
                👀
              </PostUtil.Tag>
              <PostUtil.Tag clicked={false} color="purple">
                😂
              </PostUtil.Tag>
              <PostUtil.Tag clicked={false} color="yellow">
                👍
              </PostUtil.Tag>
              <PostUtil.Tag clicked={false} color="blue">
                ⭐
              </PostUtil.Tag>
              <PostUtil.Tag clicked={false} color="green">
                🙏
              </PostUtil.Tag>
              <Button.Action
                size="small"
                variant="custom"
                icon={<Icon.Smiley />}
              />
            </div>
    </div>*/}
        </div>
      )}
    </Card.Primary>
  );
}
