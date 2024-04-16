'use client';

import { useRouter } from 'next/navigation';
import { SideCard, Typography } from '@social/ui-shared';
import { DropDown } from '../components/DropDown';
import { useClientContext } from '../../contexts/client';
import { useEffect, useState } from 'react';
import { Skeleton } from '.';
import { ITaggedPost } from '../../types';

export default function HotTags() {
  const router = useRouter();
  const { getHotTags, setSearchTags, searchTags, setRefreshList } =
    useClientContext();
  const [hotTags, setHotTags] = useState<ITaggedPost[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const result = await getHotTags();

        if (result) {
          setHotTags(result);
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="self-start sticky top-[160px] col-span-1">
      <SideCard.Header title="Hot tags">
        <DropDown.TagsTimeframe type="text" />
      </SideCard.Header>
      <SideCard.Content>
        {loading ? (
          <Skeleton.HotTags />
        ) : hotTags && hotTags.length > 0 ? (
          <>
            <div className="grid gap-3">
              {hotTags.slice(0, 8).map((tag, index) => (
                <SideCard.Rank
                  key={index}
                  onClick={() => {
                    setSearchTags([...searchTags, tag.tag]);
                    setRefreshList(true);
                    router.push('/search');
                  }}
                  rank={index + 1}
                  tag={`# ${tag.tag}`}
                  color="amber"
                  counter={`${tag.count} ${tag.count > 1 ? ' users' : ' user'}`}
                />
              ))}
            </div>
            <SideCard.Action
              onClick={() => router.push('/hot-tags')}
              text="Explore All"
            />
          </>
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No tags yet
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
