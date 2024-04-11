'use client';

import { useRouter } from 'next/navigation';
import { SideCard, Typography } from '@social/ui-shared';
import { DropDown } from '../components/DropDown';
import { useClientContext } from '../../contexts/client';
import { useEffect, useState } from 'react';
import { Skeleton } from '.';
import { ITag } from '../../types';

export default function HotTags() {
  const router = useRouter();
  const { getHotTags } = useClientContext();
  const [hotTags, setHotTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const result = await getHotTags();

        if (result) {
          setHotTags(result);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchTags();
  }, [getHotTags]);

  return (
    <div>
      <SideCard.Header title="Hot tags">
        <DropDown.TagsTimeframe type="text" />
      </SideCard.Header>
      <SideCard.Content>
        {loading ? (
          <Skeleton.HotTags />
        ) : hotTags.length > 0 ? (
          <>
            <div className="grid gap-3">
              {hotTags.slice(0, 3).map((tag, index) => (
                <SideCard.Rank
                  key={index}
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
