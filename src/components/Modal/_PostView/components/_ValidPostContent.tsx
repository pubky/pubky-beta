'use client';

import { useEffect, useState } from 'react';
import { Typography, Post as PostUI, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { Post as PostComponent } from '@/components';
import { ImageByUri } from '@/components/ImageByUri';
import { Post } from '.';

import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';

import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import Tags from '@/components/Post/Tags';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { ImageArticle } from './_ImageArticle';

const UNBLURRED_POSTS_KEY = 'unblurred_posts';

export function ValidPostContent({ postRef, data }) {
  const { pubky } = usePubkyClientContext();
  const user = useUserProfile(data?.details?.author, pubky ?? '');

  const { setSinglePost, singlePost } = usePubkyClientContext();

  useEffect(() => {
    if (data) {
      setSinglePost(data);
    }

    return () => {
      setSinglePost(undefined);
    };
  }, [data]);

  if (!singlePost) return null;

  return (
    <>
      <div ref={postRef} key={singlePost?.details?.uri} className="scroll-mt-20">
        {String(singlePost?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase() ? (
          <LongPost data={singlePost} user={user} />
        ) : (
          <NormalPost data={singlePost} />
        )}
      </div>
      <div className="mt-3">
        <Post.PostRoot uri={singlePost?.details?.id} post={singlePost} />
      </div>
    </>
  );
}

const NormalPost = ({ data }) => {
  const isMobile = useIsMobile(1280);
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-full border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[0.8px]`;

  return (
    <div className="flex items-center relative">
      {data?.relationships?.replied && (
        <>
          <div className={lineBaseCSS} />
          <div className="absolute ml-[10px]">
            <Icon.LineHorizontal size="14" color="#444447" />
          </div>
        </>
      )}
      <PostComponent
        key={data?.details?.uri}
        post={data}
        size="full"
        fullContent
        largeView={!isMobile}
        className={data?.relationships?.replied ? 'ml-6' : ''}
        postType={'single'}
      />
    </div>
  );
};

const LongPost = ({ data, user }) => {
  const [isUnblurred, setIsUnblurred] = useState(false);
  const blurCensored = Utils.storage.get('blurCensored') as boolean;
  // Safely parse content as JSON, fallback to empty object if parsing fails
  const content = (() => {
    try {
      return JSON.parse(data?.details?.content);
    } catch (error) {
      return { title: Utils.minifyText(data?.details?.content, 20), body: data?.details?.content };
    }
  })();
  const isCensored = Utils.isPostCensored(data);
  const censored = !isUnblurred && isCensored && (blurCensored === false ? false : true);

  useEffect(() => {
    if (data?.details?.id && isCensored) {
      const unblurredPosts = (Utils.storage.get(UNBLURRED_POSTS_KEY) as string[]) || [];
      setIsUnblurred(unblurredPosts.includes(data.details.id));
    }
  }, [data?.details?.id, isCensored]);

  const handleUnblur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (data?.details?.id) {
      const unblurredPosts = (Utils.storage.get(UNBLURRED_POSTS_KEY) as string[]) || [];
      if (!unblurredPosts.includes(data.details.id)) {
        Utils.storage.set(UNBLURRED_POSTS_KEY, [...unblurredPosts, data.details.id]);
      }
    }
    setIsUnblurred(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 relative">
        <div className={`${censored && 'blur-2xl'} w-auto lg:w-[1200px] flex flex-col gap-4`}>
          <Typography.Display className="sm:leading-[64px] break-words">{content.title}</Typography.Display>
          <div className="flex w-full gap-4 justify-between items-center">
            <div className="justify-start gap-3 flex items-center mt-4 mb-2">
              <ImageByUri
                id={user?.data?.details?.id}
                isCensored={Utils.isProfileCensored(user)}
                width={48}
                height={48}
                className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full"
                alt="user-image"
              />
              <Link
                className="cursor-pointer flex flex-col md:flex-row md:gap-4 md:items-center"
                href={`/profile/${data?.details?.author}`}
              >
                <Typography.Body className={`text-2xl hover:underline hover:decoration-solid`} variant="medium-bold">
                  {Utils.minifyText(user?.data?.details?.name ?? Utils.minifyPubky(data?.details?.author), 24)}
                </Typography.Body>
                <div className="flex gap-1 -mt-1 md:mt-1 cursor-pointer">
                  <Typography.Label className="text-opacity-30">
                    {Utils.minifyPubky(data?.details?.author ?? '')}
                  </Typography.Label>
                </div>
              </Link>
            </div>
            <PostUI.Time articleView className="mr-2 cursor-default">
              {data?.details?.indexed_at}
            </PostUI.Time>
          </div>
          {data?.details?.attachments?.length > 0 && data?.details?.attachments[0] && (
            <ImageArticle
              uri={data?.details?.attachments[0]}
              width={1200}
              height={650}
              className="w-[1200px] h-auto rounded-lg mb-4"
              alt="article-image"
            />
          )}
          <div
            className="text-white break-words no-html-margins [&_a]:text-[#C8FF00] [&_a:hover]:text-[#C8FF00]/90 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:pl-0 [&_li[data-list='ordered']]:list-decimal [&_li[data-list='ordered']]:list-inside [&_li[data-list='bullet']]:before:content-['•'] [&_li[data-list='bullet']]:before:mr-2 [&_li[data-list='bullet']]:list-none [&_blockquote]:border-l-4 [&_blockquote]:border-[#444447] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_.ql-code-block-container]:bg-[#1E1E1E] [&_.ql-code-block-container]:p-4 [&_.ql-code-block-container]:rounded-lg [&_.ql-code-block-container]:font-mono [&_.ql-code-block-container]:text-sm [&_.ql-code-block-container]:my-4 [&_.ql-code-block-container]:overflow-x-auto [&_.ql-code-block-container]:whitespace-pre [&_.ql-code-block]:whitespace-pre-wrap [&_.ql-align-right]:text-right [&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify"
            dangerouslySetInnerHTML={{
              __html: Utils.sanitizeUrlsArticle(content.body)
            }}
          />
        </div>
        {censored && (
          <div
            className="absolute top-4 left-0 right-0 lg:right-auto lg:left-[100px] xl:left-[250px] flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg"
            onClick={handleUnblur}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Icon.EyeSlash size="32px" color="white" />
              <Typography.Body variant="small" className="text-center text-white">
                This article may contain sexually explicit content
              </Typography.Body>
            </div>
          </div>
        )}
        <Tags.LargeView post={data} postType="single" articleView />
      </div>
    </div>
  );
};
