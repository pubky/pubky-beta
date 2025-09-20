'use client';

import { Utils } from '@social/utils-shared';
import LinkPreview from '@/components/ui-shared/lib/Post/_Preview';
import { GitHub } from '@/components/ui-shared/lib/Preview/Github';
import { useEffect, useMemo, useState } from 'react';
import { Tweet } from 'react-tweet';
import Parsing from '../Content/_Parsing';
import { Button, Skeleton, Typography } from '@social/ui-shared';
import { FileView, PostView } from '@/types/Post';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import { PostThread } from 'react-bluesky-embed';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useInlineUrls } from '@/hooks/useInlineUrls';
import { useFileLoading } from '@/hooks/useFileLoading';
import Link from 'next/link';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { useModal } from '@/contexts';

// QVAC hooks
import { useTranslation } from '@/hooks/useTranslation';
import { useSummarization } from '@/hooks/useSummarization';
import { useRecomendTags } from '@/hooks/useRecommendTags';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  fullContent?: boolean;
  largeView?: boolean;
  children?: React.ReactNode;
  repostView?: boolean;
  replyView?: boolean;
  isCensored?: boolean;
}

export default function Content({
  post,
  fullContent = false,
  largeView = false,
  children,
  repostView,
  replyView,
  isCensored
}: PostProps) {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const blurCensored = Utils.storage.get('blurCensored') as boolean | undefined;
  const [isUnblurred, setIsUnblurred] = useState(false);
  const censored = !isUnblurred && isCensored && (blurCensored === false ? false : true);

  const text = post?.details?.content;
  const files = post?.details?.attachments;

  // URL previews / embeds
  const {
    fileContents: externalFileContents,
    preview,
    videoId,
    tweetId,
    githubUrl,
    spotifyUrl,
    blueskyUrl
  } = useInlineUrls({ text: text?.toString() || '', files });

  const { fileContents, loading } = useFileLoading({
    files,
    externalFileContents
  });

  useEffect(() => {
    if (post?.details?.uri && isCensored) {
      const unblurredPosts = (Utils.storage.get('unblurred_posts') as string[]) || [];
      setIsUnblurred(unblurredPosts.includes(post.details.uri));
    }
  }, [post?.details?.uri, isCensored]);

  const uri = post?.details?.uri;
  const generateFileUrl = (file: FileView, type = 'main') => {
    if (file.src === 'external') return file.uri;
    return `${BASE_URL}/${file.owner_id}/${file.id}/${type}`;
  };

  const handleOpenModal = (index: number) => {
    openModal('filesCarousel', {
      fileContents: fileContents,
      currentFileIndex: index
    });
  };

  // =========================
  // Derive clean content text
  // =========================
  const cleanedText = useMemo(() => text?.toString()?.replace(/\n{3,}/g, '\n\n') ?? '', [text]);

  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(cleanedText);
    } catch {
      return { body: cleanedText };
    }
  }, [cleanedText]);

  const textToMinified = parsedContent?.body || cleanedText;
  const minifiedContent = useMemo(() => Utils.minifyContent(textToMinified, 7, 500), [textToMinified]);
  const contentText = fullContent ? textToMinified : minifiedContent;
  const showMore = !fullContent && textToMinified !== minifiedContent;

  // =========================
  // Translate / Summarize / Tags
  // =========================
  const { translate, loading: tLoading, error: tError } = useTranslation(); // EN -> ES
  const { summarize, loading: sLoading, error: sError } = useSummarization();
  const { recommend, loading: rLoading, error: rError } = useRecomendTags();

  const [translation, setTranslation] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const onTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslation('');
    try {
      const out = await translate(contentText);
      setTranslation(out);
    } catch {
      /* handled by hook error */
    }
  };

  const onSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSummary('');
    try {
      const out = await summarize(contentText);
      setSummary(out);
    } catch {
      /* handled by hook error */
    }
  };

  const onRecommend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTags([]);
    try {
      const out = await recommend(contentText); // expect string[] of length 3
      setTags(out.slice(0, 3));
    } catch {
      /* handled by hook error */
    }
  };

  const anyLoading = tLoading || sLoading || rLoading;

  return (
    <div className="w-full relative">
      <div
        id="post-content-text"
        className={`text-white break-words ${largeView && 'text-2xl'} ${censored && 'blur-2xl'}`}
      >
        {(() => {
          try {
            if (
              String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase() &&
              parsedContent?.title &&
              parsedContent?.body
            ) {
              const truncatedBody =
                parsedContent.body.length > 200 ? parsedContent.body.substring(0, 200) + '...' : parsedContent.body;

              return (
                <div className="w-full justify-between flex flex-col md:flex-row gap-4">
                  <div>
                    <Typography.Body className="mb-1" variant="large-bold">
                      {parsedContent.title}
                    </Typography.Body>
                    <div
                      className="opacity-70 text-white break-words no-html-margins [&_a]:text-[#C8FF00] [&_a:hover]:text-[#C8FF00]/90 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:pl-0 [&_li[data-list='ordered']]:list-decimal [&_li[data-list='ordered']]:list-inside [&_li[data-list='bullet']]:before:content-['•'] [&_li[data-list='bullet']]:before:mr-2 [&_li[data-list='bullet']]:list-none [&_blockquote]:border-l-4 [&_blockquote]:border-[#444447] [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_.ql-code-block-container]:bg-[#1E1E1E] [&_.ql-code-block-container]:p-4 [&_.ql-code-block-container]:rounded-lg [&_.ql-code-block-container]:font-mono [&_.ql-code-block-container]:text-sm [&_.ql-code-block-container]:my-4 [&_.ql-code-block-container]:overflow-x-auto [&_.ql-code-block-container]:whitespace-pre [&_.ql-code-block]:whitespace-pre-wrap [&_.ql-align-right]:text-right [&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify"
                      dangerouslySetInnerHTML={{
                        __html: Utils.sanitizeUrlsArticle(truncatedBody)
                      }}
                    />
                  </div>
                  {fileContents.length > 0 && (
                    <div>
                      {loading ? (
                        <Skeleton.File className="h-[250px]" />
                      ) : (
                        fileContents.map((file, index) => {
                          return (
                            <div key={index} className="relative">
                              {file.content_type === 'skeleton' ? (
                                <Skeleton.File className="h-[250px]" />
                              ) : (
                                <img
                                  src={generateFileUrl(file, file.content_type !== 'image/gif' ? 'feed' : 'main')}
                                  alt={file.name || `Image ${index + 1}`}
                                  width={360}
                                  height={200}
                                  className="w-full min-w-[200px] max-w-[360px] h-[104px] object-cover rounded-[8px] overflow-hidden"
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            }
          } catch (error) {
            console.error(error);
          }
          return (
            <Parsing largeView={largeView} fullContent={fullContent} repostView={repostView}>
              {contentText}
            </Parsing>
          );
        })()}

        {showMore && (
          <Link href={Utils.encodePostUri(uri)} className="text-[#C8FF00] hover:text-opacity-80">
            Show more
          </Link>
        )}

        {/* Actions row: Translate / Summarize / Recommend Tags */}
        <div className="mt-4 flex flex-row flex-wrap items-center gap-2">
          <div className="inline-flex">
            <Button.Medium
              onClick={onTranslate}
              disabled={anyLoading || !contentText}
              className="!inline-flex !w-auto h-8 px-3 py-2"
            >
              🌐 {tLoading ? 'Translating…' : 'QVAC Translate (ES)'}
            </Button.Medium>
          </div>

          <div className="inline-flex">
            <Button.Medium
              onClick={onSummarize}
              disabled={anyLoading || !contentText}
              className="!inline-flex !w-auto h-8 px-3 py-2"
            >
              📝 {sLoading ? 'Summarizing…' : 'QVAC Summarize'}
            </Button.Medium>
          </div>

          <div className="inline-flex">
            <Button.Medium
              onClick={onRecommend}
              disabled={anyLoading || !contentText}
              className="!inline-flex !w-auto h-8 px-3 py-2"
            >
              🏷️ {rLoading ? 'Recommending…' : 'QVAC Recommend Tags'}
            </Button.Medium>
          </div>
        </div>

        {/* Results */}
        {(translation || tError) && (
          <div className="mt-3 rounded-lg border border-white/10 p-3">
            <Typography.Body variant="small-bold" className="mb-1">
              Spanish Translation
            </Typography.Body>
            {tError ? (
              <Typography.Body className="text-red-400">{tError}</Typography.Body>
            ) : (
              <Typography.Body className="opacity-80 whitespace-pre-wrap">{translation}</Typography.Body>
            )}
          </div>
        )}

        {(summary || sError) && (
          <div className="mt-3 rounded-lg border border-white/10 p-3">
            <Typography.Body variant="small-bold" className="mb-1">
              Summary
            </Typography.Body>
            {sError ? (
              <Typography.Body className="text-red-400">{sError}</Typography.Body>
            ) : (
              <Typography.Body className="opacity-80 whitespace-pre-wrap">{summary}</Typography.Body>
            )}
          </div>
        )}

        {(tags.length > 0 || rError) && (
          <div className="mt-3 rounded-lg border border-white/10 p-3">
            <Typography.Body variant="small-bold" className="mb-2">
              Recommended Tags
            </Typography.Body>
            {rError ? (
              <Typography.Body className="text-red-400">{rError}</Typography.Body>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <div>
            {!replyView && String(post?.details?.kind) !== PubkyAppPostKind[1].toLocaleLowerCase() && (
              <div>
                {videoId && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="w-full max-w-[560px] relative border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden"
                  >
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                      title="YouTube video player"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                {preview && !videoId && !tweetId && !githubUrl && !spotifyUrl && !blueskyUrl && (
                  <div onClick={(event) => event.stopPropagation()}>
                    <LinkPreview url={preview} />
                  </div>
                )}
                {tweetId && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="no-scrollbar w-full max-w-[300px] sm:max-w-[384px] overflow-y-auto"
                  >
                    <Tweet id={tweetId} />
                  </div>
                )}
                {githubUrl && (
                  <div onClick={(event) => event.stopPropagation()}>
                    <GitHub url={githubUrl} />
                  </div>
                )}
                {spotifyUrl && (
                  <div onClick={(event) => event.stopPropagation()} className="mt-4">
                    <SpotifyEmbed link={spotifyUrl} />
                  </div>
                )}
                {blueskyUrl.url && blueskyUrl.did && blueskyUrl.rkey && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="mt-4 no-scrollbar w-full max-w-[300px] sm:max-w-[480px] overflow-y-auto"
                  >
                    <PostThread
                      params={{
                        did: blueskyUrl.did,
                        rkey: blueskyUrl.rkey
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {fileContents.length > 0 && String(post?.details?.kind) !== PubkyAppPostKind[1].toLocaleLowerCase() && (
              <div className="flex flex-col gap-4 mt-2">
                {replyView ? (
                  <div className="flex flex-col gap-2">
                    {fileContents.map((file, index) => (
                      <Link
                        key={index}
                        onClick={(event) => event.stopPropagation()}
                        className="text-[#C8FF00] break-words"
                        href={generateFileUrl(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${file.uri.slice(0, 12)}...${file.uri.slice(-12)}`}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <>
                    {fileContents.some(
                      (file) =>
                        file?.content_type.startsWith('image') ||
                        file?.content_type.startsWith('video') ||
                        file?.content_type === 'skeleton'
                    ) && (
                      <div className="grid gap-1 overflow-hidden max-h-[544px]">
                        {(() => {
                          const mediaFiles = fileContents.filter(
                            (file) =>
                              file?.content_type.startsWith('image') ||
                              file?.content_type.startsWith('video') ||
                              file?.content_type === 'skeleton'
                          );

                          let layoutClass = '';
                          const widthMedia = mediaFiles.length === 1 ? 'w-auto md:min-w-[400px]' : 'w-full';
                          if (mediaFiles.length === 1) {
                            layoutClass = 'grid-cols-1';
                          } else if (mediaFiles.length === 2) {
                            layoutClass = 'grid-cols-2';
                          } else if (mediaFiles.length === 3) {
                            layoutClass = 'grid-cols-2 grid-rows-2';
                          } else {
                            layoutClass = 'grid-cols-2 grid-rows-2';
                          }

                          return (
                            <div className={`grid ${layoutClass} gap-1 max-h-[544px]`}>
                              {mediaFiles.map((file, index) => {
                                let specialGrid = '';
                                if (mediaFiles.length === 3) {
                                  if (index === 0) specialGrid = 'row-span-2 col-span-1';
                                  if (index === 1) specialGrid = 'row-span-1 col-start-2 row-start-1';
                                  if (index === 2) specialGrid = 'row-span-1 col-start-2 row-start-2';
                                }
                                const fileContentsIndex = fileContents.findIndex((f) => f.id === file.id);

                                return (
                                  <div
                                    key={index}
                                    className={`relative cursor-pointer ${specialGrid}`}
                                    style={{
                                      height:
                                        mediaFiles.length === 1
                                          ? 'auto'
                                          : mediaFiles.length === 3 && index === 0
                                            ? 'calc(544px - 4px)'
                                            : mediaFiles.length === 3
                                              ? 'calc((544px - 4px) / 2)'
                                              : 'calc((544px - 4px) / 2)'
                                    }}
                                  >
                                    {file.content_type === 'skeleton' ? (
                                      <Skeleton.File className={mediaFiles.length === 1 ? 'h-[250px]' : 'h-full'} />
                                    ) : file.content_type.startsWith('image') ? (
                                      <img
                                        src={generateFileUrl(file, file.content_type !== 'image/gif' ? 'feed' : 'main')}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleOpenModal(fileContentsIndex);
                                        }}
                                        alt={file.name || `Image ${index + 1}`}
                                        className={`${widthMedia} h-full max-h-[544px] object-cover rounded-[10px] overflow-hidden`}
                                      />
                                    ) : (
                                      <div
                                        className="flex justify-center items-center bg-black rounded-[10px] overflow-hidden w-full h-full"
                                        style={{ aspectRatio: '16/9' }}
                                      >
                                        <video
                                          src={generateFileUrl(file)}
                                          controls
                                          onClick={(event) => event.stopPropagation()}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {fileContents
                        .filter(
                          (file) => !file?.content_type.startsWith('image') && !file?.content_type.startsWith('video')
                        )
                        .map((file, index) => {
                          const isPDF = file?.content_type === 'application/pdf';
                          const isAudio = file?.content_type.startsWith('audio');
                          const isSkeleton = file?.content_type === 'skeleton';

                          return (
                            <div key={index}>
                              {isSkeleton ? (
                                <></>
                              ) : isPDF ? (
                                <div
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    window.open(generateFileUrl(file), '_blank');
                                  }}
                                  className="flex gap-2 w-full justify-between items-center rounded-[10px] border p-4 border-white border-opacity-10 hover:border-opacity-30"
                                >
                                  <div className="flex gap-2 items-center">
                                    {/* Replaced icons with simple text/emoji elsewhere; this is a file row */}
                                    <span>📄</span>
                                    <Typography.Body className="text-opacity-80" variant="small-bold">
                                      {Utils.minifyText(file?.name ?? generateFileUrl(file), isMobile ? 10 : 60)}
                                    </Typography.Body>
                                  </div>
                                  <Button.Medium className="w-auto h-8 px-3 py-2 whitespace-nowrap truncate">
                                    ⬇️ Download
                                  </Button.Medium>
                                </div>
                              ) : isAudio ? (
                                <audio onClick={(event) => event.stopPropagation()} controls>
                                  <source src={generateFileUrl(file)} type="audio/mpeg" />
                                  Browser does not support audio.
                                </audio>
                              ) : (
                                <p className="text-gray-500">Unsupported file type</p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div onClick={(event) => event.stopPropagation()}>{children}</div>
        </div>
      </div>
      {censored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <div className="flex flex-col items-center justify-center gap-2">
            <span style={{ fontSize: 32 }}>🙈</span>
            <Typography.Body variant="small" className="text-center text-white">
              This post may contain sexually explicit content
            </Typography.Body>
          </div>
        </div>
      )}
    </div>
  );
}
