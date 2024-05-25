'use client';

import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Post as PostUI } from '@social/ui-shared';

import { Utils } from '../../utils';
import { IPost, TLayouts, TSize } from '../../types';
import Tags from './_Tags';
import Actions from './_Actions';
import Header from './_Header';

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
  const router = useRouter();

  return (
    <div>
      <div className="gap-6 flex flex-col">
        <PostUI.Root
          className="cursor-pointer"
          onClick={() => router.push(Utils.encodePostUri(post?.uri))}
        >
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
              <div className="lg:inline-flex gap-12">
                <div
                  className={post?.tags?.length > 0 ? 'lg:w-[60%]' : 'w-full'}
                >
                  <PostUI.Content
                    text={
                      fullContent
                        ? post?.post?.content
                        : Utils.minifyText(post?.post?.content, 140)
                    }
                  />
                  {/** <img
                    alt="postImage"
                    src="/images/user.png"
                    className="mt-6 max-w-full rounded-2xl"
                  />
                  <>
                    <Content.Divider />
                    <Typography.H2>
                      Weighing Options of Bitcoin Private Key Management
                    </Typography.H2>{' '}
                    <Typography.Caption className="text-white text-opacity-80">
                      https://bitcoinmagazine.com/
                    </Typography.Caption>
                    <img
                      alt="postImage"
                      src="/images/user.png"
                      className="mt-6 max-w-full rounded-2xl"
                    />
                  </>
                  */}
                </div>
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
