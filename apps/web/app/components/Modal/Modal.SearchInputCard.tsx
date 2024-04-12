import { Card, PostUtil, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Tag } from '../../../types';
import { useClientContext } from '../../../contexts/client';
import { Skeleton } from '..';

interface SearchInputCardProps extends React.HTMLAttributes<HTMLDivElement> {
  refCard?: React.RefObject<HTMLDivElement>;
}

export default function SearchInputCard({
  refCard,
  ...rest
}: SearchInputCardProps) {
  const { getHotTags } = useClientContext();
  const [hotTags, setHotTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const result = await getHotTags();
        if (result) {
          setHotTags(result.value);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchTags();
  }, [getHotTags]);

  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge('absolute top-16', rest.className)}
      background="bg-gradient-to-t from-[#07040a] to-[#1b1820]"
    >
      <div className="flex-col gap-6 inline-flex">
        <div>
          <Typography.Label className="text-opacity-30">
            Hot tags
          </Typography.Label>
          {loading ? (
            <Skeleton.HotTags />
          ) : (
            hotTags.length > 0 && (
              <div className="mt-2 justify-start items-start">
                {hotTags.slice(0, 10).map((tag, index) => (
                  <PostUtil.Tag
                    key={index}
                    clicked={false}
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
