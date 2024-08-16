/* eslint-disable @next/next/no-img-element */
'use client';

import { useClientContext } from '@/contexts';
import { IFileContent, IPost } from '@/types';
import { Utils } from '@social/utils-shared';
import getYouTubeID from 'get-youtube-id';
import LinkPreview from 'libs/ui-shared/src/lib/Post/_Preview';
import { GitHub } from 'libs/ui-shared/src/lib/Preview/Github';
import { useEffect, useState } from 'react';
import { Tweet } from 'react-tweet';
import FilesCarousel from '../Modal/_FilesCarousel';
import Parsing from '../Content/_Parsing';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: IPost;
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
  const { getFile } = useClientContext();
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [fileContents, setFileContents] = useState<IFileContent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const text = post?.post?.content;
  const files = post?.post?.files;
  const uri = post?.uri;

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
        const fileUris = Object.values(files).map((file) => file.fileUri);
        const fetchedFiles = await Promise.all(
          fileUris.map(async (fileUri) => {
            const fetchedFile = await getFile(fileUri);
            return fetchedFile ? fetchedFile : null;
          })
        );
        setFileContents(
          fetchedFiles.filter((file) => file !== null) as IFileContent[]
        );
      }
    };

    fetchFiles();
  }, [files, getFile]);

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
      <div className={`text-white break-words ${largeView && 'text-2xl'}`}>
        <Parsing>{contentText}</Parsing>

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
        {preview && !videoId && !tweetId && !githubUrl && (
          <LinkPreview url={preview} />
        )}
        {tweetId && (
          <div className="no-scrollbar w-full max-w-[384px] overflow-y-auto">
            <Tweet id={tweetId} />
          </div>
        )}
        {githubUrl && <GitHub url={githubUrl} />}
        {fileContents.length > 0 && (
          <div
            className={`mt-4 grid gap-4 ${
              fileContents.length === 1
                ? 'grid-cols-1'
                : fileContents.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-2'
            }`}
          >
            {fileContents.map((file, index) => {
              const isVideo = file.contentType.startsWith('video');

              return (
                <div
                  key={index}
                  className={`relative cursor-pointer ${
                    fileContents.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}
                  onClick={() => openModal(index)}
                >
                  {isVideo ? (
                    <video
                      src={file.urls.main}
                      controls
                      className="w-full h-auto max-w-full max-h-[418px] object-cover rounded-[10px] overflow-hidden"
                    />
                  ) : (
                    <img
                      src={file.urls.main}
                      alt={`Fetched file ${index}`}
                      className="w-full h-auto max-w-full max-h-[418px] object-cover rounded-[10px] overflow-hidden"
                    />
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
