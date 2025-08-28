'use client';

import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import LinkPreviewer from '../LinkPreview';
import FilePreview from '../FilePreview';
import { Section } from './Section';
import { UserView } from '@/types/User';
import { twMerge } from 'tailwind-merge';
import { Utils } from '@social/utils-shared';
import { searchUsersById, searchUsersByName } from '@/services/streamService';
import { getUserProfile } from '@/services/userService';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

interface CreateContentProps extends React.HTMLAttributes<HTMLDivElement> {
  largeView?: boolean;
  autoFocus?: boolean;
  visibleTextArea?: boolean;
  handleSubmit: (content: string) => Promise<void>;
  setContent: (content: string) => void;
  content: string;
  textArea?: boolean;
  setTextArea?: React.Dispatch<React.SetStateAction<boolean>>;
  button: React.ReactNode;
  isValidContent: boolean;
  setIsValidContent: React.Dispatch<React.SetStateAction<boolean>>;
  placeHolder?: string;
  children?: React.ReactNode;
  selectedFiles?: File[];
  setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  arrayTags?: string[];
  setArrayTags?: React.Dispatch<React.SetStateAction<string[]>>;
  loading?: boolean;
  variant?: 'small';
  className?: string;
  article?: boolean;
  markdown?: boolean;
  maxLength?: number;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
  setQuote?: React.Dispatch<React.SetStateAction<string | undefined>>;
  styleSearchedUsers?: string;
  charCountArticle?: number;
  setCharCountArticle?: React.Dispatch<React.SetStateAction<number>>;
  setIsCompressing?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateContent({
  id,
  largeView = false,
  autoFocus,
  visibleTextArea = false,
  handleSubmit,
  setContent,
  content,
  textArea,
  setTextArea,
  button,
  isValidContent,
  setIsValidContent,
  placeHolder,
  selectedFiles,
  setSelectedFiles,
  arrayTags,
  setArrayTags,
  children,
  loading,
  variant,
  className,
  article,
  markdown,
  maxLength = 2000,
  isError,
  setIsError,
  setShowModalPost,
  setQuote,
  styleSearchedUsers,
  charCountArticle,
  setCharCountArticle,
  setIsCompressing
}: CreateContentProps) {
  const { profile, pubky } = usePubkyClientContext();
  const { addAlert, removeAlert, updateAlert, updateAlertCancelState, removeAllCompressionAlerts } = useAlertContext();
  const [showEmojis, setShowEmojis] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [filesBeingCompressed, setFilesBeingCompressed] = useState<number>(0);
  const hasContent = content.trim().length > 0 || selectedFiles?.length > 0 || arrayTags?.length > 0;

  const searchUsername = async (content: string) => {
    const pkMatches = content.match(/(pk:[^\s]+)/g);
    const atMatches = content.match(/(@[^\s]+)/g);

    const searchQueries = [...(pkMatches || []), ...(atMatches || [])];

    if (searchQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    // Filter out complete pubkeys and partial matches that are too short
    const filteredQueries = searchQueries.filter((query) => {
      if (query.startsWith('pk:')) {
        const userId = query.slice(3);
        const isCompletePubkey = userId.length >= 52 && /^[a-zA-Z0-9]+$/.test(userId);
        const shouldSkip = isCompletePubkey || userId.length < 3;
        return !shouldSkip;
      }
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const shouldSkip = username.length < 2;
        return !shouldSkip;
      }
      return false;
    });

    if (filteredQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    let allUserIds: string[] = [];

    for (const query of filteredQueries) {
      if (query.startsWith('@')) {
        const username = query.slice(1);
        const searchResult = await searchUsersByName(username);
        allUserIds = [...allUserIds, ...(searchResult || [])];
      } else if (query.startsWith('pk:')) {
        const userId = query.slice(3); // Remove 'pk:' prefix
        const searchResult = await searchUsersById(userId);
        allUserIds = [...allUserIds, ...(searchResult || [])];
      }
    }

    // Remove duplicates
    const uniqueUserIds = Array.from(new Set(allUserIds));

    if (uniqueUserIds.length > 0) {
      // Fetch user profiles for each unique user ID
      const userProfiles = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            return await getUserProfile(userId, pubky ?? '');
          } catch (error) {
            return null;
          }
        })
      );

      // Filter out null results and set the searched users
      const validUsers = userProfiles.filter((user): user is UserView => user !== null);
      setSearchedUsers(validUsers);
    } else {
      setSearchedUsers([]);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      searchUsername(content);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowEmojis(false);
        if (setTextArea) setTextArea(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, content, setTextArea]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && isValidContent && !isError) {
        handleSubmit(content);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isValidContent, content, arrayTags]);

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setFilePreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  useEffect(() => {
    if (selectedFiles?.length === 0) {
      filePreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      setFilePreviews([]);
    }
  }, [selectedFiles]);

  useEffect(() => {
    const handlePasteEvent = (event: ClipboardEvent) => {
      if (textAreaRef.current && document.activeElement === textAreaRef.current) {
        handlePaste(event);
      }
    };

    textAreaRef.current?.addEventListener('paste', handlePasteEvent);
    return () => {
      textAreaRef.current?.removeEventListener('paste', handlePasteEvent);
    };
  }, [selectedFiles, addAlert, setSelectedFiles, setFilePreviews]);

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    const maxImageSizeInMB = 5;
    const maxOtherSizeInMB = 20;
    const maxVideoSizeForCompressionInMB = 100;
    const maxImageSizeInBytes = maxImageSizeInMB * 1024 * 1024;
    const maxOtherSizeInBytes = maxOtherSizeInMB * 1024 * 1024;
    const maxVideoSizeForCompressionInBytes = maxVideoSizeForCompressionInMB * 1024 * 1024;

    if (items) {
      // Collect all files first
      const filesToProcess: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const isAudio = file.type.startsWith('audio/');
            const isPDF = file.type === 'application/pdf';
            const isValidType =
              (isImage && Utils.supportedImageTypes.includes(file.type)) ||
              (isVideo && Utils.supportedVideoTypes.includes(file.type)) ||
              (isAudio && Utils.supportedAudioTypes.includes(file.type)) ||
              isPDF;

            if (!isValidType) {
              addAlert('File not supported', 'warning');
              continue;
            }

            if (selectedFiles.length + filesToProcess.length + filesBeingCompressed >= 4) {
              addAlert('Max 4 files only.', 'warning');
              continue;
            }

            filesToProcess.push(file);
          } else {
            addAlert('File not supported', 'warning');
          }
        }
      }

      // Process files sequentially
      if (filesToProcess.length > 0) {
        const validFiles: File[] = [];

        for (let i = 0; i < filesToProcess.length; i++) {
          const file = filesToProcess[i];
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');

          if (isImage && file.size > maxImageSizeInBytes) {
            let loadingAlertId: number | undefined;
            try {
              loadingAlertId = addAlert(`Compressing image ${i + 1}/${filesToProcess.length}...`, 'loading');
              setIsCompressing(true);
              setFilesBeingCompressed((prev) => prev + 1);
              const resizedFile = await Utils.resizeImageFile(file, maxImageSizeInBytes);
              removeAlert(loadingAlertId);
              validFiles.push(resizedFile);
            } catch (error) {
              // Remove the loading alert if it exists
              if (loadingAlertId) {
                removeAlert(loadingAlertId);
              }
              // Show the actual error message from the compression function
              const errorMessage = error instanceof Error ? error.message : String(error);
              addAlert(errorMessage, 'warning');
              continue;
            } finally {
              setFilesBeingCompressed((prev) => Math.max(0, prev - 1));
              // Only set compressing to false when all files are processed
              if (i === filesToProcess.length - 1) {
                setIsCompressing(false);
              }
            }
          } else if (
            isImage &&
            file.type !== 'image/gif' &&
            file.type !== 'image/svg+xml' &&
            file.type !== 'image/webp'
          ) {
            try {
              const cleaned = await Utils.stripImageMetadata(file);
              validFiles.push(cleaned);
            } catch (e) {
              validFiles.push(file);
            }
          } else if (isVideo && file.size > maxOtherSizeInBytes) {
            // Check if video is too large for compression
            if (file.size > maxVideoSizeForCompressionInBytes) {
              addAlert('The maximum allowed size for videos compression is 100 MB', 'warning');
              continue;
            }

            let loadingAlertId: number | undefined;
            let abortController: AbortController | undefined;
            try {
              abortController = new AbortController();

              loadingAlertId = addAlert(
                `Compressing video ${i + 1}/${filesToProcess.length}...`,
                'loading',
                () => {
                  // Cancel compression when cancel button is clicked
                  abortController?.abort();
                },
                true
              ); // Start with cancel disabled
              setIsCompressing(true);
              setFilesBeingCompressed((prev) => prev + 1);

              const resizedFile = await Utils.resizeVideoFile(
                file,
                maxOtherSizeInBytes,
                (progress) => {
                  // Update the alert with current progress
                  updateAlert(loadingAlertId!, `Compressing video ${i + 1}/${filesToProcess.length}... ${progress}%`);

                  // Enable cancel button on first progress
                  if (progress > 0) {
                    updateAlertCancelState(loadingAlertId!, false);
                  }
                },
                abortController.signal
              );

              removeAlert(loadingAlertId);
              validFiles.push(resizedFile);
            } catch (error) {
              // Remove the loading alert first
              if (loadingAlertId) {
                removeAlert(loadingAlertId);
              }

              // Check if it was cancelled
              if (error instanceof Error && error.message === 'Compression cancelled') {
                // Don't show error for cancellation
                continue;
              }

              // Show the error message from compression
              const errorMessage = error instanceof Error ? error.message : String(error);
              addAlert(errorMessage, 'warning');
              continue;
            } finally {
              setFilesBeingCompressed((prev) => Math.max(0, prev - 1));
              // Only set compressing to false when all files are processed
              if (i === filesToProcess.length - 1) {
                setIsCompressing(false);
              }
            }
          } else if (!isImage && !isVideo && file.size > maxOtherSizeInBytes) {
            addAlert('The maximum allowed size is 20 MB', 'warning');
            continue;
          } else {
            validFiles.push(file);
          }
        }

        // Add all processed files at once
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        const updatedPreviews = [...filePreviews, ...newPreviews].slice(0, 4);

        setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles].slice(0, 4));
        setFilePreviews(updatedPreviews);

        if (updatedPreviews.length < filePreviews.length) {
          filePreviews.slice(updatedPreviews.length).forEach((preview) => URL.revokeObjectURL(preview));
        }

        // Ensure compressing state is reset when all files are processed
        if (filesBeingCompressed === 0) {
          setIsCompressing(false);
        }
      }
    }
  };

  return (
    <div
      id={`${id}`}
      className={twMerge(
        `${
          largeView ? 'p-12' : 'p-6'
        } w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex`,
        className
      )}
    >
      <div ref={wrapperRef} className="w-full flex justify-between gap-3 items-start flex-col">
        <div className={variant ? 'flex w-full gap-4' : 'w-full'}>
          <Section.UserArea
            name={profile?.name ?? Utils.minifyPubky(pubky ?? '')}
            largeView={largeView}
            warningLink={hasContent}
            variant={variant}
          />
          <Section.InputArea
            textAreaRef={textAreaRef}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            content={content}
            className="mt-[6px]"
            setContent={setContent}
            searchedUsers={searchedUsers}
            setSearchedUsers={setSearchedUsers}
            setCursorPosition={setCursorPosition}
            setTextArea={setTextArea}
            largeView={largeView}
            setIsValidContent={setIsValidContent}
            autoFocus={autoFocus}
            placeHolder={placeHolder}
            setFilePreviews={setFilePreviews}
            loading={loading}
            markdown={markdown}
            maxLength={maxLength}
            setIsError={setIsError}
            handlePaste={handlePaste}
            styleSearchedUsers={styleSearchedUsers}
            setCharCountArticle={setCharCountArticle}
            setIsCompressing={setIsCompressing}
            filesBeingCompressed={filesBeingCompressed}
            setFilesBeingCompressed={setFilesBeingCompressed}
          />
        </div>
        <LinkPreviewer setQuote={setQuote} content={content} />
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="relative mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                filePreview={filePreviews[index]}
                index={index}
                removeFile={removeFile}
                loading={loading || false}
              />
            ))}
          </div>
        )}
        {children}
        <Section.FooterArea
          loading={loading || false}
          visibleTextArea={visibleTextArea}
          textArea={textArea}
          content={content}
          setContent={setContent}
          cursorPosition={cursorPosition}
          setCursorPosition={setCursorPosition}
          setIsValidContent={setIsValidContent}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          setArrayTags={setArrayTags}
          arrayTags={arrayTags}
          filePreviews={filePreviews}
          setFilePreviews={setFilePreviews}
          showEmojis={showEmojis}
          setShowEmojis={setShowEmojis}
          largeView={largeView}
          button={button}
          wrapperRefEmojis={wrapperRefEmojis}
          article={article}
          markdown={markdown}
          maxLength={maxLength}
          setShowModalPost={setShowModalPost}
          charCountArticle={charCountArticle}
          setIsCompressing={setIsCompressing}
          filesBeingCompressed={filesBeingCompressed}
          setFilesBeingCompressed={setFilesBeingCompressed}
        />
      </div>
    </div>
  );
}
