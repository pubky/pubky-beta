import { twMerge } from 'tailwind-merge';
import { Icon, Post as PostUI } from '@social/ui-shared';
import Header from './_Header';
import Content from './_Content';
import Actions from './_Actions';
import { PostType, PostView } from '@/types/Post';
import Tags from './Tags';

interface MainPostContentProps {
  post: PostView;
  largeView: boolean;
  fullContent: boolean;
  line?: boolean;
  lineStyle?: string;
  repostView: boolean;
  replyView?: boolean;
  restClassName?: string;
  postType: PostType;
}

export default function MainPostContent({
  post,
  largeView,
  fullContent,
  line,
  lineStyle,
  repostView,
  replyView,
  restClassName,
  postType
}: MainPostContentProps) {
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[0.8px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.5px]`;

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
        className={twMerge(line && 'ml-6', largeView && 'p-12 inline-flex flex-row gap-6 xl:gap-12', restClassName)}
      >
        <div className="w-full flex-col justify-between inline-flex">
          <div>
            <Header post={post} largeView={largeView} repostView={repostView} />
            <Content replyView={replyView} largeView={largeView} post={post} fullContent={fullContent} />
          </div>
          <div>
            <div className={`flex flex-col md:flex-row ${largeView ? '' : 'justify-between'}`}>
              {!repostView && <Tags.Standard largeView={largeView} post={post} postType={postType} />}
              {!repostView && <Actions post={post} postType={postType} />}
            </div>
          </div>
        </div>
        {largeView && <Tags.LargeView post={post} postType={postType} />}
      </PostUI.MainCard>
    </div>
  );
}
