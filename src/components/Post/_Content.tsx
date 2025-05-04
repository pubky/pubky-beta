'use client';

import { Utils } from '@social/utils-shared';
import getYouTubeID from 'get-youtube-id';
import LinkPreview from '@/components/ui-shared/lib/Post/_Preview';
import { GitHub } from '@/components/ui-shared/lib/Preview/Github';
import { useEffect, useState } from 'react';
import { Tweet } from 'react-tweet';
import Parsing from '../Content/_Parsing';
import { Button, Icon, Typography } from '@social/ui-shared';
import { FileView, PostView } from '@/types/Post';
import { getFile } from '@/services/fileService';
import { Spotify } from 'react-spotify-embed';
import { useIsMobile } from '@/hooks/useIsMobile';
import Link from 'next/link';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { useModal } from '@/contexts';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  fullContent?: boolean;
  largeView?: boolean;
  children?: React.ReactNode;
  repostView?: boolean;
  replyView?: boolean;
}

export default function Content({
  post,
  fullContent = false,
  largeView = false,
  children,
  repostView,
  replyView
}: PostProps) {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [fileContents, setFileContents] = useState<FileView[]>([]);
  const [loading, setLoading] = useState(true);

  const cleanText = (text: string) => {
    return text.replace(/\n{3,}/g, '\n\n');
  };

  const text = post?.details?.content;
  const files = post?.details?.attachments;
  const uri = post?.details?.uri;
  const generateFileUrl = (file: FileView, type = 'main') => `${BASE_URL}/${file.owner_id}/${file.id}/${type}`;

  async function checkForLink(text: string) {
    const urlRegex = /(https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+)/g;
    let urls = text.match(urlRegex);

    if (urls) {
      let url = urls[0];
      url = url.replace(/[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/, '');

      const postRegex = new RegExp(`/post/([^/]+)/([^/]+)`);
      if (postRegex.test(url)) return;
      setPreview(url);

      const youtubeId = getYouTubeID(url);
      if (youtubeId) setVideoId(youtubeId);

      const twitterRegex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
      const twitterMatch = url.match(twitterRegex);
      if (twitterMatch) setTweetId(twitterMatch[3]);

      const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+(?:\/.*)?/;
      if (githubRegex.test(url)) setGithubUrl(url);

      const spotifyRegex = /https:\/\/open\.spotify\.com\/track\/\w+/;
      if (spotifyRegex.test(url)) setSpotifyUrl(url);
    }
  }

  useEffect(() => {
    const cleanedText = cleanText(text.toString());
    const words = cleanedText.split(/\s+/);
    words.forEach((word: string) => checkForLink(word.trim()));
  }, [text]);

  useEffect(() => {
    const retryInterval = 5000; // 5 seconds
    let retryTimeouts: NodeJS.Timeout[] = [];

    const fetchFile = async (fileUri: string, retryCount = 0): Promise<FileView | null> => {
      try {
        const fetchedFile = await getFile(fileUri);
        return fetchedFile;
      } catch (error) {
        // Return skeleton and schedule retry
        if (retryCount < 5) {
          // Limit retries to prevent infinite loops
          const timeoutId = setTimeout(async () => {
            const result = await fetchFile(fileUri, retryCount + 1);
            if (result) {
              // Update the specific file in fileContents
              setFileContents((prev) =>
                prev.map((f) =>
                  f.urls === JSON.stringify({ main: 'skeleton' }) ? { ...result, urls: result.urls } : f
                )
              );
            }
          }, retryInterval);
          retryTimeouts.push(timeoutId);
        }
        return {
          content_type: 'skeleton',
          urls: JSON.stringify({ main: 'skeleton' }),
          name: 'Loading...',
          created_at: Date.now(),
          src: 'skeleton',
          uri: fileUri,
          id: `skeleton-${fileUri}`,
          indexed_at: Date.now(),
          owner_id: `skeleton-${fileUri}`,
          size: 0
        };
      }
    };

    const fetchFiles = async () => {
      if (files) {
        setLoading(true);
        const fileUris = Object.values(files).map((file) => file);
        const fetchedFiles = await Promise.all(fileUris.map((fileUri) => fetchFile(fileUri)));

        setFileContents(
          fetchedFiles
            .filter((file): file is FileView => file !== null)
            .map((file) => ({
              ...file,
              urls: file.urls
            }))
        );
        setLoading(false);
      }
    };

    fetchFiles();

    // Cleanup timeouts on unmount
    return () => {
      retryTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [files]);

  const handleOpenModal = (index: number) => {
    openModal('filesCarousel', {
      fileContents: fileContents,
      currentFileIndex: index
    });
  };

  const cleanedText = cleanText(text.toString());
  const parsedContent = (() => {
    try {
      return JSON.parse(cleanedText);
    } catch {
      return { body: cleanedText };
    }
  })();
  const textToMinified = parsedContent?.body || cleanedText;
  const minifiedContent = Utils.minifyContent(textToMinified, 7, 500);
  const contentText = fullContent ? textToMinified : minifiedContent;

  const showMore = !fullContent && textToMinified !== minifiedContent;

  const renderSkeleton = () => <div className="animate-pulse bg-gray-700 rounded-[10px] w-full h-[350px]" />;

  return (
    <div className="w-full">
      <div id="post-content-text" className={`text-white break-words ${largeView && 'text-2xl'}`}>
        {(() => {
          try {
            if (
              String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase() &&
              parsedContent?.title &&
              parsedContent?.body
            ) {
              const truncatedBody =
                parsedContent.body.length > 200 ? parsedContent.body.substring(0, 200) + '...' : parsedContent.body;

              const formattedContent = Utils.formatSpaceArticle(truncatedBody);

              return (
                <div className="w-full justify-between flex flex-col md:flex-row gap-4">
                  <div>
                    <Typography.Body className="mb-1" variant="large-bold">
                      {parsedContent.title}
                    </Typography.Body>
                    <div
                      className="opacity-70 text-white break-words no-html-margins [&_a]:text-[#C8FF00] [&_a:hover]:text-[#C8FF00]/90 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_ol]:list-decimal [&_ol]:pl-4"
                      dangerouslySetInnerHTML={{
                        __html: formattedContent
                      }}
                    />
                  </div>
                  {fileContents.length > 0 && (
                    <div>
                      {loading
                        ? renderSkeleton()
                        : fileContents.map((file, index) => {
                            return (
                              <div key={index} className="relative">
                                {file.content_type === 'skeleton' ? (
                                  renderSkeleton()
                                ) : (
                                  <img
                                    src={generateFileUrl(file, file.content_type !== 'image/gif' ? 'feed' : 'main')}
                                    alt={`Fetched file ${index}`}
                                    width={360}
                                    height={200}
                                    className="w-full min-w-[200px] max-w-[360px] h-[104px] object-cover rounded-[8px] overflow-hidden"
                                  />
                                )}
                              </div>
                            );
                          })}
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
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                {preview && !videoId && !tweetId && !githubUrl && !spotifyUrl && (
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
                    <Spotify link={spotifyUrl} />
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
                        className="text-[#C8FF00] break-all"
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
                    {fileContents.some((file) => file?.content_type.startsWith('image')) && (
                      <div className="grid gap-1 overflow-hidden max-h-[544px]">
                        {(() => {
                          const imageFiles = fileContents.filter((file) => file?.content_type.startsWith('image'));

                          let layoutClass = '';
                          const widthImg = imageFiles.length === 1 ? 'w-auto md:min-w-[400px]' : 'w-full';
                          if (imageFiles.length === 1) {
                            layoutClass = 'grid-cols-1';
                          } else if (imageFiles.length === 2) {
                            layoutClass = 'grid-cols-2';
                          } else if (imageFiles.length === 3) {
                            layoutClass = 'grid-cols-2 grid-rows-2';
                          } else {
                            layoutClass = 'grid-cols-2 grid-rows-2';
                          }

                          return (
                            <div className={`grid ${layoutClass} gap-1 max-h-[544px]`}>
                              {imageFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className={`relative cursor-pointer ${
                                    imageFiles.length === 3 && index === 0 ? 'row-span-2 col-span-2 pb-1' : ''
                                  }`}
                                  style={{ height: imageFiles.length === 1 ? 'auto' : 'calc(544px / 2)' }}
                                >
                                  <img
                                    src={generateFileUrl(file, file.content_type !== 'image/gif' ? 'feed' : 'main')}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleOpenModal(index);
                                    }}
                                    alt={`Fetched file ${index}`}
                                    className={`${widthImg} h-full max-h-[544px] object-cover rounded-[10px] overflow-hidden`}
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {fileContents
                        .filter((file) => !file?.content_type.startsWith('image'))
                        .map((file, index) => {
                          const isVideo = file?.content_type.startsWith('video');
                          const isPDF = file?.content_type === 'application/pdf';
                          const isAudio = file?.content_type.startsWith('audio');
                          const isSkeleton = file?.content_type === 'skeleton';

                          return (
                            <div key={index}>
                              {isSkeleton ? (
                                renderSkeleton()
                              ) : isVideo ? (
                                <video
                                  src={generateFileUrl(file)}
                                  controls
                                  onClick={(event) => event.stopPropagation()}
                                  className="w-auto md:min-w-[400px] h-auto max-w-full max-h-[544px] object-cover rounded-[10px] overflow-hidden"
                                />
                              ) : isPDF ? (
                                <div
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    window.open(generateFileUrl(file), '_blank');
                                  }}
                                  className="flex gap-2 w-full justify-between items-center rounded-[10px] border p-4 border-white border-opacity-10 hover:border-opacity-30"
                                >
                                  <div className="flex gap-2 items-center">
                                    <Icon.FileText size="20" />
                                    <Typography.Body className="text-opacity-80" variant="small-bold">
                                      {Utils.minifyText(file?.name ?? generateFileUrl(file), isMobile ? 20 : 60)}
                                    </Typography.Body>
                                  </div>
                                  <Button.Medium
                                    className="w-auto h-8 px-3 py-2"
                                    icon={<Icon.DownloadSimple size="16" />}
                                  >
                                    Download
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
    </div>
  );
}
