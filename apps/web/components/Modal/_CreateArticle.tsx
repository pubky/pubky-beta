import { Button, Icon, Input, Modal as ModalUI } from '@social/ui-shared';
import CreateContent from '../CreateContent';
import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { Section } from '../CreateContent/Section';
import LinkPreviewer from '../LinkPreview';
import { UserView } from '@/types/User';
import FilePreview from '../FilePreview';
import Modal from '.';
import { searchUsersByUsername } from '@/services/userService';

interface CreateArticleProps {
  showModalArticle: boolean;
  setShowModalArticle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateArticle({
  showModalArticle,
  setShowModalArticle,
}: CreateArticleProps) {
  const { pubky, createArticle, createTag, profile } = usePubkyClientContext();
  const [isDragging, setIsDragging] = useState(false);
  const { setContent: setContentAlert, setShow } = useAlertContext();
  const [contentTitle, setContentTitle] = useState('');
  const [contentArticle, setContentArticle] = useState('');
  const [showModalTag, setShowModalTag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendingArticle, setSendingArticle] = useState(false);
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [isValidContent, setIsValidContent] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const modalArticleRef = useRef<HTMLDivElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const regex =
    /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;

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
        'Long',
        selectedFile
      );
      const match = newArticle && newArticle?.uri.match(regex);

      if (newArticle && match) {
        const postId = match[2];
        for (const tag of updatedTags) {
          await createTag(pubky ?? '', postId, tag);
        }

        setContentAlert('Article created!');
        setShow(true);
      } else {
        setContentAlert('Something wrong. Try again', 'warning');
        setShow(true);
      }
      setArrayTags([]);
      setContentArticle('');
      setShowModalArticle(false);
      setSelectedFile([]);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingArticle(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalArticleRef.current &&
        !modalArticleRef.current.contains(event.target as Node)
      ) {
        setShowModalArticle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalArticleRef, setShowModalArticle]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
        //if (setTextArea) setTextArea(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, contentArticle]);

  const searchProfiles = async (text: string) => {
    try {
      const result = await searchUsersByUsername(text);
      return result || [];
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  };

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
        const searchResult = await searchUsersByUsername(username);
        results = [...results, ...(searchResult || [])];
      } else if (query.startsWith('pk:')) {
        const searchResult = await searchProfiles(query);
        results = [...results, ...(searchResult || [])];
      }
    }
    setSearchedUsers(results.length > 0 ? results : []);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'Enter' &&
        isValidContent
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
    if (file) {
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
        const isValidType = file.type.startsWith('image/');
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
        selectedFile && validFiles.slice(0, 3 - selectedFile.length);
      const newPreviews =
        newFiles && newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFile &&
        newFiles &&
        setSelectedFile((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
      newPreviews &&
        setFilePreviews((prevPreviews) =>
          [...prevPreviews, ...newPreviews].slice(0, 3)
        );
    }
  };

  return (
    <ModalUI.Root
      modalRef={modalArticleRef}
      show={showModalArticle}
      closeModal={() => {
        setShowModalArticle(false);
        //setArrayTags([]);
      }}
      className="md:w-[1200px] max-h-[600px] overflow-y-auto max-w-[1200px]"
    >
      <ModalUI.CloseAction
        onClick={() => {
          setShowModalArticle(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <ModalUI.Header title="New Article" />
        <div className="flex items-center relative">
          <div className="w-full">
            <div
              //id={`${id}`}
              className="w-full rounded-lg flex-col justify-start items-start inline-flex"
            >
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
                    uriPic={(profile?.image as string) ?? '/images/Userpic.png'}
                    name={profile?.name ?? 'Loading...'}
                    largeView
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
                        <img
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
                            Add file
                          </p>
                        </div>
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
                    maxLength={1000}
                    //setTextArea={setTextArea}
                    largeView
                    setIsValidContent={setIsValidContent}
                    placeHolder="Write your article"
                    setFilePreviews={setFilePreviews}
                    loading={sendingArticle}
                  />
                </div>
                <LinkPreviewer content={contentArticle} />
                <Section.FooterArea
                  visibleTextArea
                  textArea
                  content={contentArticle}
                  setContent={setContentArticle}
                  showModalTag={showModalTag}
                  cursorPosition={cursorPosition}
                  setCursorPosition={setCursorPosition}
                  setIsValidContent={setIsValidContent}
                  //setSelectedFiles={setSelectedFiles}
                  //selectedFiles={selectedFiles}
                  setArrayTags={setArrayTags}
                  maxLength={1000}
                  arrayTags={arrayTags}
                  setFilePreviews={setFilePreviews}
                  showEmojis={showEmojis}
                  setShowEmojis={setShowEmojis}
                  largeView
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
                            !contentTitle
                              ? 'gray'
                              : 'white'
                          }
                        />
                      }
                      disabled={
                        !isValidContent ||
                        selectedFile.length === 0 ||
                        !contentArticle
                      }
                      loading={sendingArticle}
                      onClick={
                        isValidContent &&
                        selectedFile.length > 0 &&
                        contentTitle &&
                        !sendingArticle
                          ? () => handleSubmit(contentArticle)
                          : undefined
                      }
                    >
                      Publish
                    </Button.Medium>
                  }
                  wrapperRefEmojis={wrapperRefEmojis}
                  setShowModalTag={setShowModalTag}
                />
              </div>
              {arrayTags && setArrayTags && (
                <Modal.TagCreatePost
                  arrayTags={arrayTags}
                  setArrayTags={setArrayTags}
                  showModalTag={showModalTag}
                  setShowModalTag={setShowModalTag}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalUI.Root>
  );
}
