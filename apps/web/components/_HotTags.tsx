'use client';

import { useRouter } from 'next/navigation';
import { Icon, SideCard, Typography } from '@social/ui-shared';
// import { DropDown } from '../components/DropDown';
import { useClientContext } from '../contexts/client';
import { useEffect, useState } from 'react';
import { ITaggedPost } from '../types';
import { Utils } from '../utils';

export default function HotTags() {
  const router = useRouter();
  const { getHotTags, setSearchTags, searchTags } = useClientContext();
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

  return (
    <div className="self-start sticky top-[160px] col-span-1">
      <SideCard.Header title="Hot tags">
        {/**<DropDown.TagsTimeframe type="text" />*/}
      </SideCard.Header>
      <SideCard.Content>
        {loading ? (
          <>
            <div className="flex w-full justify-center">
              <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
            </div>
            <Typography.Body
              variant="medium-bold"
              className="col-span-3 m-2 flex justify-center items-center gap-6 text-opacity-20"
            >
              Loading Hot Tags
            </Typography.Body>
          </>
        ) : hotTags && hotTags.length > 0 ? (
          <>
            <div className="grid gap-3">
              {hotTags.slice(0, 8).map((tag, index) => (
                <SideCard.Rank
                  key={index}
                  onClick={() => handleTagSearch(tag.tag)}
                  rank={index + 1}
                  tag={Utils.minifyText(tag.tag, 10)}
                  color="fuchsia"
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
