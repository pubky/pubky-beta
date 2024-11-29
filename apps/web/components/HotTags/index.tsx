'use client';

import { SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { useHotTags } from '@/hooks/useTag';
import Link from 'next/link';

export default function HotTags() {
  const { data, isLoading, isError } = useHotTags(0, 8);
  const hotTags = data;
  if (isError) console.error(isError);

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
  };
  */
  }

  return (
    <div className="col-span-1 mb-6">
      <SideCard.Header title="Hot tags">
        {/**<DropDown.TagsTimeframe type="text" />*/}
      </SideCard.Header>
      <SideCard.Content>
        {isLoading ? (
          <Skeletons.Simple />
        ) : hotTags && hotTags.length > 0 ? (
          <>
            <div className="grid gap-2">
              {hotTags.slice(0, 8).map((tag, index) => (
                <Link key={index} href={`/search?tags=${tag?.label}`}>
                  <SideCard.Rank
                    rank={index + 1}
                    tag={Utils.minifyText(tag?.label, 21)}
                    color={tag?.label && Utils.generateRandomColor(tag?.label)}
                    counter={`${tag?.post_count}`}
                    boxShadow={false}
                  />
                </Link>
              ))}
            </div>
            <Link href="/hot">
              <SideCard.Action textCSS='text-[13px]' className="mt-3" text="Explore All" />
            </Link>
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
