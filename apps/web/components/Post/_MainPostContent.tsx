import { twMerge } from 'tailwind-merge';
import { Icon, Post as PostUI } from '@social/ui-shared';
import Header from './_Header';
import Content from './_Content';
import Actions from './_Actions';
import Tags from './_Tags';
import TagsLargeView from './_TagsLargeView';
import { PostView } from '@/types/Post';

interface MainPostContentProps {
  post: PostView;
  largeView: boolean;
  fullContent: boolean;
  line?: boolean;
  lineStyle?: string;
  repostView: boolean;
  showModalTag: boolean;
  showSheetTag: boolean;
  setShowModalTag: any;
  setShowSheetTag: any;
  restClassName?: string;
}

export default function MainPostContent({
  post,
  largeView,
  fullContent,
  line,
  lineStyle,
  repostView,
  showModalTag,
  setShowModalTag,
  showSheetTag,
  setShowSheetTag,
  restClassName,
}: MainPostContentProps) {
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#ffffff40] after:content-[' * '] after:bg-[#ffffff40] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[1px]`;

  return (
    <div className="flex items-center relative">
      {line && (
        <>
          <div className={twMerge(lineBaseCSS, lineStyle)} />
          <div className="absolute ml-[10px]">
            <Icon.LineHorizontal size="14" color="#ffffff40" />
          </div>
        </>
      )}
      <PostUI.MainCard
        className={twMerge(
          line && 'ml-6',
          largeView && 'p-12 inline-flex flex-row gap-12',
          restClassName,
        )}
      >
        <div className="w-full flex-col justify-between inline-flex">
          <div>
            <Header post={post} largeView={largeView} repostView={repostView} />
            <Content
              largeView={largeView}
              post={post}
              fullContent={fullContent}
            />
          </div>
          <div>
            <div
              className={`flex flex-col md:flex-row ${
                largeView ? '' : 'justify-between'
              }`}
            >
              {!repostView && (
                <Tags
                  showModalTag={showModalTag}
                  setShowModalTag={setShowModalTag}
                  showSheetTag={showSheetTag}
                  setShowSheetTag={setShowSheetTag}
                  largeView={largeView}
                  post={post}
                />
              )}
              {!repostView && (
                <Actions
                  setShowSheetTag={setShowSheetTag}
                  setShowModalTag={setShowModalTag}
                  post={post}
                />
              )}
            </div>
          </div>
        </div>
        {largeView && <TagsLargeView post={post} />}
      </PostUI.MainCard>
    </div>
  );
}
