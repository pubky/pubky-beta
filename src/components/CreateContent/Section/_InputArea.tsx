'use client';

import { Icon, Input } from '@social/ui-shared';
import { useState } from 'react';
import { useAlertContext } from '@/contexts';
import Modal from '../../Modal';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';
import { twMerge } from 'tailwind-merge';

interface InputAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  textAreaRef?: React.RefObject<HTMLTextAreaElement>;
  selectedFiles?: File[];
  setSelectedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  content: string;
  setContent: (content: string) => void;
  setSearchedUsers: React.Dispatch<React.SetStateAction<UserView[]>>;
  searchedUsers: UserView[];
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  setTextArea?: React.Dispatch<React.SetStateAction<boolean>>;
  largeView?: boolean;
  setIsValidContent: React.Dispatch<React.SetStateAction<boolean>>;
  autoFocus?: boolean;
  placeHolder?: string;
  setFilePreviews?: React.Dispatch<React.SetStateAction<string[]>>;
  loading?: boolean;
  className?: string;
  maxLength?: number;
  markdown?: boolean;
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
  handlePaste?: any;
  styleSearchedUsers?: string;
  setCharCountArticle?: React.Dispatch<React.SetStateAction<number>>;
  setIsCompressing?: React.Dispatch<React.SetStateAction<boolean>>;
  filesBeingCompressed?: number;
  setFilesBeingCompressed?: React.Dispatch<React.SetStateAction<number>>;
}

export default function InputArea({
  id,
  textAreaRef,
  selectedFiles,
  setSelectedFiles,
  content,
  setContent,
  setSearchedUsers,
  searchedUsers,
  setCursorPosition,
  largeView,
  setTextArea,
  setIsValidContent,
  autoFocus,
  placeHolder,
  setFilePreviews,
  loading,
  className,
  maxLength = 2000,
  markdown,
  setIsError,
  handlePaste,
  styleSearchedUsers,
  setCharCountArticle,
  setIsCompressing,
  filesBeingCompressed,
  setFilesBeingCompressed
}: InputAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { addAlert, removeAlert } = useAlertContext();

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

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const maxImageSizeInMB = 5;
    const maxOtherSizeInMB = 20;
    const maxVideoSizeForCompressionInMB = 100;
    const maxImageSizeInBytes = maxImageSizeInMB * 1024 * 1024;
    const maxOtherSizeInBytes = maxOtherSizeInMB * 1024 * 1024;
    const maxVideoSizeForCompressionInBytes = maxVideoSizeForCompressionInMB * 1024 * 1024;

    if (files) {
      // Check file limit before processing - include files being compressed
      const totalFiles = (selectedFiles?.length || 0) + files.length + (filesBeingCompressed || 0);
      if (totalFiles > 4) {
        addAlert('Max 4 files only.', 'warning');
        return;
      }

      const processFiles = async () => {
        const validFiles: File[] = [];

        for (const file of Array.from(files)) {
          // Check if we already have 4 files - include files being compressed
          if (validFiles.length >= 4 - (selectedFiles?.length || 0) - (filesBeingCompressed || 0)) {
            break;
          }

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
            addAlert('File type not supported.', 'warning');
            continue;
          }

          if (isImage && file.size > maxImageSizeInBytes) {
            try {
              const loadingAlertId = addAlert(
                `Compressing image ${validFiles.length + 1}/${files.length}...`,
                'loading'
              );
              setIsCompressing(true);
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => prev + 1);
              const resizedFile = await Utils.resizeImageFile(file, maxImageSizeInBytes);
              removeAlert(loadingAlertId);
              validFiles.push(resizedFile);
            } catch (error) {
              addAlert('The maximum allowed size for images is 5 MB', 'warning');
              continue;
            } finally {
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => Math.max(0, prev - 1));
              // Only set compressing to false when all files are processed
              if (validFiles.length === files.length) {
                setIsCompressing(false);
              }
            }
          } else if (isVideo && file.size > maxOtherSizeInBytes) {
            // Check if video is too large for compression
            if (file.size > maxVideoSizeForCompressionInBytes) {
              addAlert('The maximum allowed size for videos compression is 100 MB', 'warning');
              continue;
            }
            try {
              const loadingAlertId = addAlert(
                `Compressing video ${validFiles.length + 1}/${files.length}...`,
                'loading'
              );
              setIsCompressing(true);
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => prev + 1);
              const resizedFile = await Utils.resizeVideoFile(file, maxOtherSizeInBytes);
              removeAlert(loadingAlertId);
              validFiles.push(resizedFile);
            } catch (error) {
              addAlert('The maximum allowed size for videos is 20 MB', 'warning');
              continue;
            } finally {
              setFilesBeingCompressed && setFilesBeingCompressed((prev) => Math.max(0, prev - 1));
              // Only set compressing to false when all files are processed
              if (validFiles.length === files.length) {
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

        const newFiles = validFiles.slice(0, 4 - (selectedFiles?.length || 0));
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

        setSelectedFiles && newFiles && setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 4));
        newPreviews &&
          setFilePreviews &&
          setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews].slice(0, 4));

        if (newFiles && newFiles?.length > 0 && setTextArea) {
          setTextArea(true);
        }

        // Ensure compressing state is reset when all files are processed
        if (filesBeingCompressed === 0) {
          setIsCompressing(false);
        }
      };

      await processFiles();
    }
  };

  const handleUserClick = (userId: string) => {
    // Find the last @ or pk: pattern in the text and replace it
    const atRegex = /@[^\s]*$/;
    const pkRegex = /pk:[^\s]*$/;

    let newContent = content;

    // Check if there's a pk: pattern at the end of the text
    if (pkRegex.test(content)) {
      newContent = content.replace(pkRegex, `pk:${userId}`);
    }
    // Check if there's an @ pattern at the end of the text
    else if (atRegex.test(content)) {
      newContent = content.replace(atRegex, `pk:${userId}`);
    }
    // If no pattern found, just append the pk:userId
    else {
      newContent = content + ` pk:${userId}`;
    }

    setContent(newContent);
    setSearchedUsers([]);
  };

  const handleEditorChange = (text: string) => {
    if (!text) return;

    if (text.length > maxLength) {
      setIsError && setIsError(true);
    } else {
      setIsError && setIsError(false);
    }

    let textFiltered = text.replace(/&nbsp;/g, ' ');

    // If the text is just a single <br> or empty, set it to empty string
    if (textFiltered.trim() === '<br>' || textFiltered.trim() === '') {
      textFiltered = '';
    }

    setContent(textFiltered);
    setCursorPosition(textFiltered.length);
    setIsValidContent(Utils.isValidContent(textFiltered));
  };

  return (
    <div
      onPaste={handlePaste}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full relative"
    >
      {markdown ? (
        <Input.MarkdownEditorComponent
          id={id}
          onChange={handleEditorChange}
          placeHolder={placeHolder}
          autoFocus={autoFocus}
          value={content}
          maxLength={maxLength}
          setCharCount={setCharCountArticle}
        />
      ) : (
        <Input.CursorArea
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
            setCursorPosition(e.target.selectionStart);
            setIsValidContent(Utils.isValidContent(e.target.value));
          }}
          disabled={loading}
          onSelect={(e: React.SyntheticEvent<HTMLTextAreaElement>) => {
            setCursorPosition(e.currentTarget.selectionStart);
          }}
          ref={textAreaRef}
          autoFocus={autoFocus}
          value={content}
          maxLength={maxLength}
          onClick={() => setTextArea && setTextArea(true)}
          className={twMerge(`w-full max-h-[300px] h-auto ${largeView && 'text-2xl min-h-[50px]'}`, className)}
          placeholder={placeHolder}
        />
      )}
      {isDragging && selectedFiles && (
        <div className="flex justify-center items-center z-50">
          <Icon.Plus size="64" color="gray" />
        </div>
      )}
      {searchedUsers.length > 0 && (
        <Modal.SearchedUsersCard
          handleUserClick={handleUserClick}
          searchedUsers={searchedUsers}
          className={styleSearchedUsers}
        />
      )}
    </div>
  );
}
