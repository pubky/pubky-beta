'use client';

import {
  BottomSheet,
  Button,
  Icon,
  Input,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { Section } from '../CreateContent/Section';
import Image from 'next/image';
import LinkPreviewer from '../LinkPreview';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { useEffect, useRef, useState } from 'react';
import { UserView } from '@/types/User';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useStreamSearchUsersByUsername } from '@/hooks/useStream';

interface CreateArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreateArticle({
  show,
  setShow,
  title,
  className,
}: CreateArticleProps) {
  const { pubky, createArticle, createTag, profile } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [isError, setIsError] = useState(false);
  const { addAlert } = useAlertContext();
  const [errorFile, setErrorFile] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentArticle, setContentArticle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendingArticle, setSendingArticle] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  //const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('article'));
  }, []);

  const handleSubmit = async (content: string) => {
    if (sendingArticle) {
      return;
    }
    try {
      setSendingArticle(true);

      const hashtags = Utils.extractHashtags(content);
      const updatedTags = [...new Set([...arrayTags, ...hashtags])];

      const newArticle = await createArticle(
        contentTitle,
        content,
        'long',
        selectedFile,
      );
      const match = newArticle && newArticle?.uri.match(regex);

      if (newArticle && match) {
        const postId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', postId, tag);
        }

        addAlert('Article created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentArticle('');
      setShow(false);
      setSelectedFile([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingArticle(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      searchUsername(contentArticle);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentArticle]);

  const searchUsername = async (content: string) => {
    const pkMatches = content.match(/(pk:[^\s]+)/g);
    const atMatches = content.match(/(@[^\s]+)/g);

    const searchQueries = [...(pkMatches || []), ...(atMatches || [])];

    if (searchQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    let results: UserView[] = [];

    for (const query of searchQueries) {
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const searchResult = useStreamSearchUsersByUsername(username);
        results = [...results, ...(searchResult.data || [])];
      }
    }
    setSearchedUsers(results.length > 0 ? results : []);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'Enter' &&
        isValidContent &&
        selectedFile.length > 0 &&
        contentTitle &&
        !isError &&
        !sendingArticle
      ) {
        handleSubmit(contentArticle);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidContent, contentArticle]);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      const isValidType =
        (isImage && Utils.supportedImageTypes.includes(file.type)) ||
        (isVideo && Utils.supportedVideoTypes.includes(file.type)) ||
        (isAudio && Utils.supportedAudioTypes.includes(file.type)) ||
        file.type === 'application/pdf';

      if (!isValidType) {
        setErrorFile('File type not supported.');
        return;
      }

      if (file.size > maxSizeInBytes) {
        setErrorFile('The maximum allowed size is 20 MB');
        return;
      }
      setSelectedFile([file]);
    }
  };

  const removeFile = () => {
    setSelectedFile([]);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const maxSizeInMB = 20;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        const isValidType =
          (isImage && Utils.supportedImageTypes.includes(file.type)) ||
          (isVideo && Utils.supportedVideoTypes.includes(file.type)) ||
          (isAudio && Utils.supportedAudioTypes.includes(file.type)) ||
          file.type === 'application/pdf';

        if (!isValidType) {
          addAlert('File type not supported.', 'warning');
          return false;
        }
        if (file.size > maxSizeInBytes) {
          addAlert('The maximum allowed size is 20 MB', 'warning');
          return false;
        }
        return true;
      });

      const newFiles =
        selectedFile && validFiles.slice(0, 3 - selectedFile.length);
      //const newPreviews =
      // newFiles && newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFile &&
        newFiles &&
        setSelectedFile((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
      //newPreviews &&
      // setFilePreviews((prevPreviews) =>
      //   [...prevPreviews, ...newPreviews].slice(0, 3)
      // );
    }
  };

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'New Article'}
      className={className}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center relative">
          <div className="w-full">
            <div className="w-full rounded-lg flex-col justify-start items-start inline-flex">
              <div
                ref={wrapperRef}
                className="w-full flex justify-between gap-3 items-start flex-col"
              >
                <div className="w-full">
                  <Input.Cursor
                    placeholder="Title"
                    autoFocus
                    className="h-auto text-[40px] font-bold sm:text-[64px]"
                    defaultValue={contentTitle}
                    disabled={sendingArticle}
                    maxLength={30}
                    autoCorrect="off"
                    //error={errors.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContentTitle(e.target.value)
                    }
                  />
                  <Section.UserArea
                    uriPic={
                      (profile?.image as string) ?? '/images/webp/Userpic.webp'
                    }
                    name={profile?.name ?? Utils.minifyPubky(pubky ?? '')}
                    largeView={!isMobile}
                  />
                  <div className="relative my-4">
                    {selectedFile.length > 0 ? (
                      <div className="relative">
                        <div
                          onClick={removeFile}
                          className="z-10 cursor-pointer absolute top-2.5 right-2.5 w-10 h-10 p-3 bg-[#05050a] bg-opacity-50 hover:bg-opacity-30 rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex"
                        >
                          <Icon.Trash size="20" />
                        </div>
                        <Image
                          src={URL.createObjectURL(selectedFile[0])}
                          alt="Uploaded Preview"
                          className="w-[1200px] h-auto max-h-[500px] rounded-lg"
                          width={1000}
                          height={650}
                        />
                      </div>
                    ) : (
                      <div
                        onClick={handleFileClick}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="flex flex-col justify-center items-center h-[216px] min-w-[200px] bg-white bg-opacity-10 rounded-lg p-4 cursor-pointer"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div
                          className={`${
                            isDragging && selectedFile
                              ? 'opacity-100'
                              : 'opacity-50'
                          } hover:opacity-100`}
                        >
                          <Icon.Plus size="64" />
                          <p className="mt-2 text-white text-sm text-center">
                            Add image
                          </p>
                        </div>
                        <Typography.Body
                          className="text-red-500 mt-4"
                          variant="small"
                        >
                          {errorFile}
                        </Typography.Body>
                      </div>
                    )}
                  </div>
                  <Section.InputArea
                    //selectedFiles={selectedFiles}
                    //setSelectedFiles={setSelectedFiles}
                    content={contentArticle}
                    className="mt-[6px]"
                    setContent={setContentArticle}
                    searchedUsers={searchedUsers}
                    setSearchedUsers={setSearchedUsers}
                    setCursorPosition={setCursorPosition}
                    maxLength={50000}
                    isError={isError}
                    setIsError={setIsError}
                    //setTextArea={setTextArea}
                    largeView={!isMobile}
                    setIsValidContent={setIsValidContent}
                    placeHolder={placeholder}
                    //setFilePreviews={setFilePreviews}
                    loading={sendingArticle}
                    markdown
                  />
                </div>
                <LinkPreviewer content={contentArticle} />
                <Section.FooterArea
                  visibleTextArea
                  textArea
                  content={contentArticle}
                  setContent={setContentArticle}
                  cursorPosition={cursorPosition}
                  setCursorPosition={setCursorPosition}
                  setIsValidContent={setIsValidContent}
                  setArrayTags={setArrayTags}
                  maxLength={50000}
                  arrayTags={arrayTags}
                  showEmojis={showEmojis}
                  setShowEmojis={setShowEmojis}
                  largeView={!isMobile}
                  noFile
                  button={
                    <Button.Medium
                      id="post-btn"
                      className="w-auto"
                      variant="line"
                      icon={
                        <Icon.PaperPlaneRight
                          color={
                            !isValidContent ||
                            selectedFile.length === 0 ||
                            isError ||
                            !contentTitle
                              ? 'gray'
                              : 'white'
                          }
                        />
                      }
                      disabled={
                        !isValidContent ||
                        selectedFile.length === 0 ||
                        isError ||
                        !contentTitle
                      }
                      loading={sendingArticle}
                      onClick={
                        isValidContent &&
                        selectedFile.length > 0 &&
                        contentTitle &&
                        !isError &&
                        !sendingArticle
                          ? () => handleSubmit(contentArticle)
                          : undefined
                      }
                    >
                      Publish
                    </Button.Medium>
                  }
                  wrapperRefEmojis={wrapperRefEmojis}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet.Root>
  );
}
