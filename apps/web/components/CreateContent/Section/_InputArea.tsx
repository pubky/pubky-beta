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
  setFilePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  loading?: boolean;
  className?: string;
}

export default function InputArea({
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
}: InputAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { setContent: setContentAlert, setShow } = useAlertContext();

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
        const isValidType =
          file.type.startsWith('image/') ||
          file.type.startsWith('video/') ||
          file.type === 'application/pdf';
        if (!isValidType) {
          setContentAlert('File not supported', 'warning');
          setShow(true);
          return false;
        }
        if (file.size > maxSizeInBytes) {
          setContentAlert('The maximum allowed size is 20 MB', 'warning');
          setShow(true);
          return false;
        }
        return true;
      });

      const newFiles =
        selectedFiles && validFiles.slice(0, 3 - selectedFiles.length);
      const newPreviews =
        newFiles && newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles &&
        newFiles &&
        setSelectedFiles((prevFiles) =>
          [...prevFiles, ...newFiles].slice(0, 3)
        );
      newPreviews &&
        setFilePreviews((prevPreviews) =>
          [...prevPreviews, ...newPreviews].slice(0, 3)
        );
    }
  };

  const handleUserClick = (userId: string) => {
    const regex = /@\w+/;
    const newContent = content.replace(regex, `pk:${userId}`);

    setContent(newContent);
    setSearchedUsers([]);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full relative"
    >
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
        maxLength={300}
        onClick={() => setTextArea && setTextArea(true)}
        className={twMerge(
          `w-full max-h-[300px] h-auto ${largeView && 'text-2xl min-h-[50px]'}`,
          className
        )}
        placeholder={placeHolder}
      />
      {isDragging && selectedFiles && (
        <div className="flex justify-center items-center z-50">
          <Icon.Plus size="64" color="gray" />
        </div>
      )}
      {searchedUsers.length > 0 && (
        <Modal.SearchedUsersCard
          handleUserClick={handleUserClick}
          searchedUsers={searchedUsers}
        />
      )}
    </div>
  );
}
