import { useRouter } from 'next/navigation';
import { Card, Icon, PostUtil, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useClientContext } from '../../../contexts/client';
import { Skeleton } from '..';

interface SearchInputCardProps extends React.HTMLAttributes<HTMLDivElement> {
  refCard?: React.RefObject<HTMLDivElement>;
}

export default function SearchInputCard({
  refCard,
  ...rest
}: SearchInputCardProps) {
  const router = useRouter();
  const { hotTags, searchTags, setSearchTags } = useClientContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotTags) {
      setLoading(false);
    }
  }, [hotTags]);

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

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = [...searchTags];
    newTags.splice(indexToRemove, 1);
    setSearchTags(newTags);
  };

  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge('absolute top-16', rest.className)}
      background="bg-gradient-to-t from-[#07040a] to-[#1b1820]"
    >
      <div className="flex-col gap-6 inline-flex">
        {searchTags.length > 0 && (
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
                  color="amber"
                  className="mr-2 my-1"
                >
                  # {searchTag}
                </PostUtil.Tag>
              ))}
            </div>
          </div>
        )}
        <div>
          <Typography.Label className="text-opacity-30">
            Hot tags
          </Typography.Label>
          {loading ? (
            <Skeleton.HotTags />
          ) : (
            hotTags &&
            hotTags.length > 0 && (
              <div className="mt-2 justify-start items-start">
                {hotTags.slice(0, 10).map((tag, index) => (
                  <PostUtil.Tag
                    key={index}
                    clicked={false}
                    onClick={() => handleTagSearch(tag.tag)}
                    color="amber"
                    className="mr-2 my-1"
                  >
                    # {tag.tag}
                  </PostUtil.Tag>
                ))}
              </div>
            )
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
    </Card.Primary>
  );
}
