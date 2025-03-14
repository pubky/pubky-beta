import { Post as PostUI, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import Header from '../components/_Header';
import Content from '../components/_Content';
import Actions from '../components/_Actions';
import { Tags } from '@/components';

import { PostView } from '@/types/Post';
import { Utils } from '@social/utils-shared';
import { Skeleton } from '../..';
import { useRouter } from 'next/navigation';

interface RepostedPostProps {
  repostedPost?: PostView;
  loadingRepostedPost: boolean;
  largeView?: boolean;
  fullContent: boolean;
  line?: boolean;
  lineStyle?: string;
  repostView: boolean;
  restClassName?: string;
  notFoundClassName?: string;
}

export default function Post({
  repostedPost,
  loadingRepostedPost,
  largeView,
  fullContent,
  line,
  lineStyle,
  repostView,
  restClassName,
  notFoundClassName
}: RepostedPostProps) {
  const router = useRouter();
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[1px]`;

  if (loadingRepostedPost) {
    return <Skeleton.Simple />;
  }

  if (!repostedPost || repostedPost.details.content === '[DELETED]') {
    return (
      <div className={twMerge('px-6 py-2 bg-white bg-opacity-10 rounded-lg mt-2', notFoundClassName)}>
        <Typography.Body variant="small" className="text-opacity-50">
          This post has been deleted by its author.
        </Typography.Body>
      </div>
    );
  }

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        router.push(Utils.encodePostUri(repostedPost.details.uri));
      }}
    >
      <PostUI.MainCard className={restClassName}>
        <div>
          <Header post={repostedPost} largeView={largeView} repostView={repostView} />
          {line && <div className={twMerge(lineBaseCSS, lineStyle)} />}
          <div>
            <Content post={repostedPost} fullContent={fullContent} largeView={largeView} repostView={repostView} />
          </div>

          <div className={`flex flex-col md:flex-row ${largeView ? 'gap-2' : 'justify-between'}`}>
            {!repostView && <Tags.PostStandard largeView={largeView} post={repostedPost} />}
            {!repostView && <Actions post={repostedPost} />}
          </div>
        </div>
        {largeView && <Tags.PostLargeView post={repostedPost} />}
      </PostUI.MainCard>
    </div>
  );
}
