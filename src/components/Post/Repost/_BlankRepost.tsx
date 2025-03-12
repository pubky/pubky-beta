import { Icon, Post as PostUI } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import { PostComponents } from '../components';
import Tags from '../Tags';

import { PostView } from '@/types/Post';
import Post from './_RepostedPost';

interface BlankProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  repostedPost: PostView;
  loadingRepostedPost: boolean;
  repostView?: boolean;
  line?: boolean;
  lineStyle?: string;
  largeView?: boolean;
  fullContent?: boolean;
}

export default function Blank({
  post,
  repostedPost,
  loadingRepostedPost,
  repostView,
  line,
  lineStyle,
  largeView,
  fullContent,
  ...rest
}: BlankProps) {
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.5px]`;

  return (
    <div className="flex items-center relative">
      {line && (
        <>
          <div className={twMerge(lineBaseCSS, lineStyle)} />
          <div className="absolute ml-[10px]">
            <Icon.LineHorizontal size="14" color="#444447" />
          </div>
        </>
      )}
      <PostUI.MainCard
        className={twMerge(
          line && 'ml-6',
          largeView && 'p-12 inline-flex flex-row gap-6 xl:gap-12',
          'relative',
          rest.className
        )}
      >
        <div className="w-full flex-col justify-between inline-flex">
          <div>
            <PostComponents.Header post={post} largeView={largeView} />
            <PostComponents.Content largeView={largeView} post={post} fullContent={fullContent} />
          </div>
          <Post
            repostedPost={repostedPost}
            loadingRepostedPost={loadingRepostedPost}
            fullContent={fullContent}
            lineStyle={lineStyle}
            repostView
            restClassName="mt-4"
          />
          <div className={`flex flex-col md:flex-row ${largeView ? 'gap-2' : 'justify-between'}`}>
            {!repostView && <Tags.Standard largeView={largeView} post={post} />}
            {!repostView && <PostComponents.Actions post={post} />}
          </div>
        </div>
        {largeView && <Tags.LargeView post={post} />}
      </PostUI.MainCard>
    </div>
  );
}
