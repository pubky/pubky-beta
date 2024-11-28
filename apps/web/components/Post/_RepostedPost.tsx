import { Post as PostUI, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Header from './_Header';
import Content from './_Content';
import Actions from './_Actions';
import Tags from './_Tags';
import TagsLargeView from './_TagsLargeView';

import { PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import { Skeleton } from '..';
import Link from 'next/link';

interface RepostedPostProps {
  repostedPost?: PostView;
  loadingRepostedPost: boolean;
  largeView?: boolean;
  fullContent: boolean;
  line?: boolean;
  lineStyle?: string;
  repostView: boolean;
  showModalTag: boolean;
  setShowModalTag: any;
  restClassName?: string;
}

export default function RepostedPost({
  repostedPost,
  loadingRepostedPost,
  largeView,
  fullContent,
  line,
  lineStyle,
  repostView,
  showModalTag,
  setShowModalTag,
  restClassName,
}: RepostedPostProps) {
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[1px]`;

  if (loadingRepostedPost) {
    return <Skeleton.Simple />;
  }

  if (!repostedPost || repostedPost.details.content === '[DELETED]') {
    return (
      <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl mt-2">
        <Typography.Body variant="small" className="text-opacity-50">
          This post has been deleted by its author.
        </Typography.Body>
      </div>
    );
  }

  return (
    <Link
      href={Utils.encodePostUri(repostedPost.details.uri)}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <PostUI.MainCard className={restClassName}>
        <div>
          <Header post={repostedPost} largeView={largeView} />
          {line && <div className={twMerge(lineBaseCSS, lineStyle)} />}
          <div>
            <Content
              post={repostedPost}
              fullContent={fullContent}
              largeView={largeView}
            />
          </div>

          <div
            className={`flex flex-col md:flex-row ${
              largeView ? 'gap-2' : 'justify-between'
            }`}
          >
            {!repostView && (
              <Tags
                showModalTag={showModalTag}
                setShowModalTag={setShowModalTag}
                largeView={largeView}
                post={repostedPost}
              />
            )}
            {!repostView && (
              <Actions setShowModalTag={setShowModalTag} post={repostedPost} />
            )}
          </div>
        </div>
        {largeView && <TagsLargeView post={repostedPost} />}
      </PostUI.MainCard>
    </Link>
  );
}
