'use client';

import { SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { useHotTags } from '@/hooks/useTag';
import Link from 'next/link';
import { usePubkyClientContext } from '@/contexts';

export default function HotTags() {
  const { pubky } = usePubkyClientContext();
  const { data, isLoading, isError } = useHotTags(pubky, undefined, 0, 8, undefined, 'today');
  const hotTags = data;
  if (isError) console.warn(isError);

  return (
    <div id="hot-tags" className="col-span-1 mb-8">
      <SideCard.Header title="Hot Tags" />
      <SideCard.Content id="hot-tags-content">
        {isLoading ? (
          <Skeletons.Simple />
        ) : hotTags && hotTags.length > 0 ? (
          <>
            <div className="grid gap-2">
              {hotTags.slice(0, 5).map((tag, index) => (
                <SideCard.Rank
                  key={index}
                  rank={index + 1}
                  href={pubky ? `/search?tags=${tag?.label}` : ''}
                  tag={Utils.minifyText(tag?.label, 21)}
                  color={tag?.label && Utils.generateRandomColor(tag?.label)}
                  counter={`${tag?.tagged_count}`}
                  boxShadow={false}
                />
              ))}
            </div>
            {pubky && (
              <Link href="/hot">
                <SideCard.Action textCSS="text-[13px]" className="mt-3" text="Explore All" />
              </Link>
            )}
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
