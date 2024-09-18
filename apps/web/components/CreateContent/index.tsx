'use client';

import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import Modal from '../Modal';
import LinkPreviewer from '../LinkPreview';
import FilePreview from '../FilePreview';
import { Section } from './Section';
import { useUserProfile, useUsernameSearch } from '@/hooks/useUser';
import { UserView } from '@/types/User';

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
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  arrayTags: string[];
  setArrayTags: React.Dispatch<React.SetStateAction<string[]>>;
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
  placeHolder = "What's on your mind?",
  selectedFiles,
  setSelectedFiles,
  arrayTags,
  setArrayTags,
  children,
}: CreateContentProps) {
  const { pubky } = usePubkyClientContext();
  const { data } = useUserProfile(pubky ?? '');
  const profile = data;
  const { setContent: setContentAlert, setShow } = useAlertContext();
  const [showModalTag, setShowModalTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const searchProfiles = (text: string) => {
    try {
      const { data } = useUsernameSearch(text, pubky, 0, 5);
      return data || [];
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  };

  const searchUsername = (content: string) => {
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
        const { data } = useUsernameSearch(username);
        results = [...results, ...(data || [])];
      } else if (query.startsWith('pk:')) {
        const searchResult = searchProfiles(query);
        results = [...results, ...(searchResult || [])];
      }
    }
    setSearchedUsers(results.length > 0 ? results : []);
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
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'Enter' &&
        isValidContent
      ) {
        handleSubmit(content);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidContent, content]);

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!textArea) return;

      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (
              file &&
              (file.type.startsWith('image/') || file.type.startsWith('video/'))
            ) {
              if (selectedFiles.length < 3) {
                const filePreview = URL.createObjectURL(file);

                setSelectedFiles((prevFiles) => [...prevFiles, file]);
                setFilePreviews((prevPreviews) => [
                  ...prevPreviews,
                  filePreview,
                ]);
              } else {
                setContentAlert(
                  'Maximum of 3 files can be uploaded',
                  'warning'
                );
                setShow(true);
              }
            } else {
              setContentAlert('File not supported', 'warning');
              setShow(true);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [
    selectedFiles,
    setContentAlert,
    setShow,
    textArea,
    setSelectedFiles,
    setFilePreviews,
  ]);

  return (
    <div
      id={`${id}`}
      className={`${
        largeView ? 'p-12' : 'p-6'
      } w-full rounded-lg border-dashed border border-white border-opacity-30 flex-col justify-start items-start inline-flex`}
    >
      <Section.UserArea
        uriPic={profile?.details?.image ?? ''}
        name={profile?.details?.name ?? 'Loading...'}
        largeView={largeView}
      />
      <div
        ref={wrapperRef}
        className="w-full flex justify-between gap-6 items-start flex-col"
      >
        <Section.InputArea
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          content={content}
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
        />
        <LinkPreviewer content={content} />
        {selectedFiles.length > 0 && (
          <div className="relative mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                filePreview={filePreviews[index]}
                index={index}
                removeFile={removeFile}
              />
            ))}
          </div>
        )}
        {children}
        <Section.FooterArea
          visibleTextArea={visibleTextArea}
          textArea={textArea}
          content={content}
          setContent={setContent}
          showModalTag={showModalTag}
          cursorPosition={cursorPosition}
          setCursorPosition={setCursorPosition}
          setIsValidContent={setIsValidContent}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          setArrayTags={setArrayTags}
          arrayTags={arrayTags}
          setFilePreviews={setFilePreviews}
          showEmojis={showEmojis}
          setShowEmojis={setShowEmojis}
          largeView={largeView}
          button={button}
          wrapperRefEmojis={wrapperRefEmojis}
          setShowModalTag={setShowModalTag}
        />
      </div>
      <Modal.TagCreatePost
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
      />
    </div>
  );
}
