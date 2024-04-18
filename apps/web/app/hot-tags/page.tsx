/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, Skeleton } from '../components';
import { HotTags } from './components';
import { DropDown } from '../components/DropDown';
import { useClientContext } from '../../contexts/client';
import { ITaggedPost } from '../../types';

export default function Index() {
  const { getHotTags } = useClientContext();
  const [hotTags, setHotTags] = useState<ITaggedPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header className="w-52 xl:w-36 hidden md:block" title="Hot&#160;Tags">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.HotTagsReach />
          <DropDown.TagsTimeframe />
        </div>
      </Header>
      <Content.Grid className="flex-col flex gap-3">
        {loading ? (
          <Skeleton.HotTags />
        ) : hotTags.length > 0 ? (
          hotTags.map((tag, index) => (
            <div className="flex gap-3" key={index}>
              <HotTags.Rank
                rank={index + 1}
                tag={`# ${tag.tag}`}
                color="amber"
                counter={`${tag.count} ${tag.count > 1 ? ' users' : ' user'}`}
              />
              {tag?.from.slice(0, 5).map((fromItem: any, fromIndex: number) => (
                <Image
                  width={32}
                  height={32}
                  alt={`pic-${fromIndex + 1}`}
                  key={fromIndex}
                  className={`w-[32px] h-[32px] rounded-full ${
                    fromIndex !== 0 ? '-ml-5' : ''
                  }`}
                  src={fromItem.author?.profile?.image || '/images/Userpic.png'}
                />
              ))}
            </div>
          ))
        ) : (
          <Typography.H2 className="text-center font-normal text-opacity-50">
            No tags yet.
          </Typography.H2>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
