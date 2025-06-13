import { Icon, Post as PostUI, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Header from '../_Header';
import Content from '../_Content';
import Actions from '../_Actions';
import Tags from '../Tags';

import { PostView, PostType } from '@/types/Post';
import Post from './_RepostedPost';
import { Utils } from '@/components/utils-shared';

interface BlankProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  repostedPost: PostView;
  loadingRepostedPost: boolean;
  repostView?: boolean;
  line?: boolean;
  lineStyle?: string;
  largeView?: boolean;
  fullContent?: boolean;
  postType: PostType;
  showTags: boolean;
  setShowTags: (showTags: boolean) => void;
  restClassName?: string;
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
  postType,
  showTags,
  setShowTags,
  restClassName,
  ...rest
}: BlankProps) {
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.5px]`;
  const isCensoredPost = Utils.isPostCensored(post);
  const isCensoredRepostedPost = Utils.isPostCensored(repostedPost);

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
        postId={post?.details?.id}
        className={twMerge(
          line && 'ml-6',
          largeView && 'p-12 inline-flex flex-row gap-6 xl:gap-12',
          'relative',
          restClassName
        )}
      >
        <div className="w-full flex-col justify-between inline-flex">
          <div>
            <Header post={post} largeView={largeView} />
            <Content isCensored={isCensoredPost} largeView={largeView} post={post} fullContent={fullContent} />
          </div>
          <Post
            isCensored={isCensoredRepostedPost}
            repostedPost={repostedPost}
            loadingRepostedPost={loadingRepostedPost}
            fullContent={fullContent}
            lineStyle={lineStyle}
            repostView
            postType={postType}
            restClassName="mt-4"
          />
          <div className={`flex flex-col md:flex-row ${largeView ? 'gap-2' : 'justify-between'}`}>
            {!repostView && <Tags.Standard largeView={largeView} post={post} postType={postType} showTags={showTags} />}
            {!repostView && <Actions post={post} showTags={showTags} setShowTags={setShowTags} postType={postType} />}
          </div>
        </div>
        {largeView && <Tags.LargeView post={post} postType={postType} />}
      </PostUI.MainCard>
    </div>
  );
}
