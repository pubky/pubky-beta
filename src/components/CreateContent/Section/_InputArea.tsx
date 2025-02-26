'use client';

import { Icon, Input } from '@social/ui-shared';
import { useState } from 'react';
import { useAlertContext } from '@/contexts';
import Modal from '../../Modal';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';
import { twMerge } from 'tailwind-merge';

interface InputAreaProps extends React.HTMLAttributes<HTMLDivElement> {
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
}

export default function InputArea({
  id,
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
  maxLength = 1000,
  markdown,
  setIsError,
  handlePaste,
  styleSearchedUsers,
  setCharCountArticle,
}: InputAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { addAlert } = useAlertContext();

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
          addAlert('The maximum allowed size is 20 MB.', 'warning');
          return false;
        }

        return true;
      });

      if (selectedFiles && selectedFiles.length + validFiles.length > 4) {
        addAlert('Max 4 files only.', 'warning');
        return;
      }

      const newFiles =
        selectedFiles && validFiles.slice(0, 4 - selectedFiles.length);
      const newPreviews =
        newFiles && newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles &&
        newFiles &&
        setSelectedFiles((prevFiles) =>
          [...prevFiles, ...newFiles].slice(0, 4),
        );
      newPreviews &&
        setFilePreviews &&
        setFilePreviews((prevPreviews) =>
          [...prevPreviews, ...newPreviews].slice(0, 4),
        );

      if (newFiles && newFiles?.length > 0 && setTextArea) {
        setTextArea(true);
      }
    }
  };

  const handleUserClick = (userId: string) => {
    const regex = /@\w+/;
    const newContent = content.replace(regex, `pk:${userId}`);

    setContent(newContent);
    setSearchedUsers([]);
  };

  const handleEditorChange = (text: string) => {
    if (text.length > maxLength) {
      setIsError && setIsError(true);
    } else {
      setIsError && setIsError(false);
    }

    let textFiltered = text.replace(/&nbsp;/g, ' ');

    // Remove <br> tags e &nbsp;
    if (textFiltered.trim() === '<br>') {
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
          autoFocus={autoFocus}
          value={content}
          maxLength={maxLength}
          onClick={() => setTextArea && setTextArea(true)}
          className={twMerge(
            `w-full max-h-[300px] h-auto ${
              largeView && 'text-2xl min-h-[50px]'
            }`,
            className,
          )}
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
