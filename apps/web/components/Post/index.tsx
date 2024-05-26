'use client';

import { twMerge } from 'tailwind-merge';

import { Post as PostUI } from '@social/ui-shared';

import { Utils } from '../../utils';
import { IPost, TLayouts, TSize } from '../../types';
import Tags from './_Tags';
import Actions from './_Actions';
import Header from './_Header';
import Content from './_Content';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repost?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: IPost;
  layout?: TLayouts;
  fullContent?: boolean;
}

export default function Post({
  repost = false,
  size = 'full',
  post,
  layout,
  fullContent = false,
  ...rest
}: PostProps) {
  return (
    <div>
      <div className="gap-6 flex flex-col">
        <PostUI.Root href={Utils.encodePostUri(post?.uri)}>
          <div>
            {/* {repost && (
              <PostUI.RepostCard>
                <div className="justify-start items-center gap-4 flex">
                  <Button.Action
                    className="bg-black bg-opacity-100"
                    size="small"
                    variant="custom"
                    icon={<Icon.Repost size="16" />}
                  />
                  <PostUI.Username className="text-[15px] text-opacity-80">
                    Carl Smith reposted this
                  </PostUI.Username>
                </div>
                <PostUI.Time>3m</PostUI.Time>
              </PostUI.RepostCard>
            )} */}
            <PostUI.MainCard
              borderRadius={
                repost
                  ? 'rounded-bl-2xl rounded-br-2xl'
                  : 'rounded-2xl flex-grow'
              }
              className={twMerge(rest.className)}
            >
              <Header post={post} />
              <div>
                <Content post={post} fullContent={fullContent} />
                <Tags post={post} />
              </div>
              <Actions post={post} />
            </PostUI.MainCard>
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
