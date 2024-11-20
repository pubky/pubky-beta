/* eslint-disable @next/next/no-img-element */
'use client';

import { Utils } from '@social/utils-shared';
import getYouTubeID from 'get-youtube-id';
import LinkPreview from 'libs/ui-shared/src/lib/Post/_Preview';
import { GitHub } from 'libs/ui-shared/src/lib/Preview/Github';
import { useEffect, useState } from 'react';
import { Tweet } from 'react-tweet';
import FilesCarousel from '../Modal/_FilesCarousel';
import Parsing from '../Content/_Parsing';
import { Button, Icon, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { FileContent, PostView } from '@/types/Post';
import { getFile } from '@/services/fileService';
import { Spotify } from 'react-spotify-embed';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useIsMobile } from '@/hooks/useIsMobile';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  fullContent?: boolean;
  largeView?: boolean;
  children?: React.ReactNode;
}

export default function Content({
  post,
  fullContent = false,
  largeView = false,
  children,
}: PostProps) {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const isMobile = useIsMobile();
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [fileContents, setFileContents] = useState<FileContent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const text = post?.details?.content;
  const files = post?.details?.attachments;
  const uri = post?.details?.uri;

  function checkForLink(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    if (urls) {
      const url = urls[0];
      setPreview(url);

      const youtubeId = getYouTubeID(url);
      if (youtubeId) {
        setVideoId(youtubeId);
      }

      const twitterRegex =
        /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
      const twitterMatch = url.match(twitterRegex);
      if (twitterMatch) {
        const tweetId = twitterMatch[3];
        setTweetId(tweetId);
      }

      const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+/;
      const githubMatch = url.match(githubRegex);
      if (githubMatch) {
        setGithubUrl(githubMatch[0]);
      }

      const spotifyRegex = /https:\/\/open\.spotify\.com\/track\/\w+/;
      if (spotifyRegex.test(url)) {
        setSpotifyUrl(url);
      }
    }
  }

  const cleanText = (text: string) => {
    return text.replace(/\n{3,}/g, '\n\n');
  };

  useEffect(() => {
    const cleanedText = cleanText(text.toString());
    const splitInLines = cleanedText.split(' ');
    if (splitInLines.length >= 1) {
      splitInLines.forEach((line: string) => {
        checkForLink(line.trim());
      });
    }
  }, [text]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (files) {
        const fileUris = Object.values(files).map((file) => file);
        const fetchedFiles = await Promise.all(
          fileUris.map(async (fileUri) => {
            const fetchedFile = await getFile(fileUri);
            return fetchedFile ? fetchedFile : null;
          }),
        );
        setFileContents(
          fetchedFiles
            .filter((file) => file !== null)
            .map((file) => ({
              ...file,
              urls: file!.urls, // Ensure 'urls' is a string
            })) as FileContent[],
        );
      }
    };

    fetchFiles();
  }, [files]);

  const openModal = (index: number) => {
    setCurrentFileIndex(index);
    setShowModal(true);
  };

  const cleanedText = cleanText(text.toString());
  const minifiedContent = Utils.minifyContent(cleanedText, 10);
  const contentText = fullContent ? cleanedText : minifiedContent;

  const showMore = !fullContent && cleanedText !== minifiedContent;

  return (
    <div
      className="w-full cursor-text"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        id="post-content-text"
        className={`text-white break-words ${largeView && 'text-2xl'}`}
      >
        {(() => {
          try {
            if (post?.details?.kind === 'Long') {
              const parsedContent = JSON.parse(contentText);
              if (parsedContent.title && parsedContent.body) {
                const truncatedBody =
                  parsedContent.body.length > 300
                    ? parsedContent.body.substring(0, 300) + '...'
                    : parsedContent.body;

                return (
                  <div className="w-full justify-between flex flex-col md:flex-row gap-8">
                    <div>
                      <Typography.Body className="mb-2" variant="large-bold">
                        {parsedContent.title}
                      </Typography.Body>
                      <div className="opacity-70">
                        <MarkdownPreview source={truncatedBody} />
                      </div>
                    </div>
                    <div>
                      {fileContents.map((file, index) => {
                        return (
                          <div key={index} className="relative">
                            <Image
                              src={`${BASE_URL}/${JSON.parse(file?.urls).main}`}
                              alt={`Fetched file ${index}`}
                              width={360}
                              height={200}
                              className="w-full h-auto max-w-[360px] max-h-[200px] min-w-[200px] object-cover rounded-[10px] overflow-hidden"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            }
          } catch (error) {
            console.error(error);
          }
          return <Parsing fullContent={fullContent}>{contentText}</Parsing>;
        })()}

        {showMore && (
          <a
            href={Utils.encodePostUri(uri)}
            className="text-white text-opacity-80 hover:text-opacity-100"
          >
            Show more
          </a>
        )}
        {videoId && (
          <div className="w-full max-w-[560px] relative border border-stone-800 hover:border-stone-700 mt-4 rounded-xl overflow-hidden">
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
          <LinkPreview url={preview} />
        )}
        {tweetId && (
          <div className="no-scrollbar w-full max-w-[384px] overflow-y-auto">
            <Tweet id={tweetId} />
          </div>
        )}
        {githubUrl && <GitHub url={githubUrl} />}
        {spotifyUrl && (
          <div className="mt-4">
            <Spotify link={spotifyUrl} />
          </div>
        )}
        {fileContents.length > 0 && post?.details?.kind !== 'Long' && (
          <div
            className={`mt-4 flex flex-col md:grid gap-4 ${
              fileContents.length === 1
                ? 'grid-cols-1'
                : fileContents.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2'
            }`}
          >
            {fileContents.map((file, index) => {
              const isVideo = file?.content_type.startsWith('video');
              const isImage = file?.content_type.startsWith('image');
              const isPDF = file?.content_type === 'application/pdf';
              const isAudio = file?.content_type.startsWith('audio');
              // const widthImage = fileContents.length > 1 ? 'w-full' : 'w-auto';

              return (
                <div
                  key={index}
                  className={`relative cursor-pointer ${
                    fileContents.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}
                  onClick={() => (isImage ? openModal(index) : undefined)}
                >
                  {isVideo ? (
                    <video
                      src={`${BASE_URL}/${JSON.parse(file?.urls).main}`}
                      controls
                      className="w-full min-w-[200px] h-auto max-w-full max-h-[744px] object-cover rounded-[10px] overflow-hidden"
                    />
                  ) : isImage ? (
                    <img
                      src={`${BASE_URL}/${JSON.parse(file?.urls).main}`}
                      alt={`Fetched file ${index}`}
                      width={800}
                      height={418}
                      className="w-full min-w-[200px] h-auto max-w-full max-h-[744px] object-cover rounded-[10px] overflow-hidden"
                    />
                  ) : isPDF ? (
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(
                          `${BASE_URL}/${JSON.parse(file?.urls).main}`,
                          '_blank',
                        );
                      }}
                      className="flex gap-2 w-full justify-between items-center rounded-[10px] border p-4 border-white border-opacity-10 hover:border-opacity-30"
                    >
                      <div className="flex gap-2 items-center">
                        <Icon.FileText size="20" />
                        <Typography.Body
                          className="text-opacity-80"
                          variant="small-bold"
                        >
                          {Utils.minifyText(
                            file?.name ??
                              `${BASE_URL}/${JSON.parse(file?.urls).main}`,
                            isMobile ? 20 : 60,
                          )}
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
                    <audio controls>
                      <source
                        src={`${BASE_URL}/${JSON.parse(file?.urls).main}`}
                        type="audio/mpeg"
                      />
                      Browser do not support audio.
                    </audio>
                  ) : (
                    <p className="text-gray-500">Unsupported file type</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {children}
        {showModal && fileContents.length > 0 && (
          <FilesCarousel
            fileContents={fileContents}
            currentFileIndex={currentFileIndex}
            setCurrentFileIndex={setCurrentFileIndex}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </div>
    </div>
  );
}
