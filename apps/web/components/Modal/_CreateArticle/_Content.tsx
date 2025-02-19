import { Button, Icon, Input, Typography } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';
import Image from 'next/image';
import { useStreamSearchUsersByUsername } from '@/hooks/useStream';
import { Section } from '@/components/CreateContent/Section';
import { useIsMobile } from '@/hooks/useIsMobile';

interface CreateArticleProps {
  setShowModalArticle: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentCreateArticle({
  setShowModalArticle,
  setShowModalPost,
}: CreateArticleProps) {
  const { pubky, createArticle, profile } = usePubkyClientContext();
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const [isError, setIsError] = useState(false);
  const { addAlert } = useAlertContext();
  const [errorFile, setErrorFile] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentArticle, setContentArticle] = useState('');
  const [charCountArticle, setCharCountArticle] = useState(0);
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
        selectedFile,
        updatedTags,
      );

      if (newArticle) {
        addAlert('Article created!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentArticle('');
      setShowModalPost && setShowModalPost(false);
      setShowModalArticle(false);
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

  {
    /**const searchProfiles = async (text: string) => {
        try {
          const result = await searchUsersByUsername(text);
          return result || [];
        } catch (error) {
          console.error('Error searching profiles:', error);
          return [];
        }
      }; */
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis, wrapperRef]);

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
                maxLength={50}
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
                    <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                      <Image
                        src={URL.createObjectURL(selectedFile[0])}
                        alt="Uploaded Preview"
                        className="w-[1200px] rounded-lg"
                        width={1000}
                        height={650}
                      />
                    </div>
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
                content={contentArticle}
                className="mt-[6px]"
                setContent={setContentArticle}
                searchedUsers={searchedUsers}
                setSearchedUsers={setSearchedUsers}
                setCursorPosition={setCursorPosition}
                maxLength={50000}
                isError={isError}
                setIsError={setIsError}
                largeView={!isMobile}
                setIsValidContent={setIsValidContent}
                placeHolder={placeholder}
                loading={sendingArticle}
                setCharCountArticle={setCharCountArticle}
                markdown
              />
            </div>
            <Section.FooterArea
              loading={sendingArticle}
              visibleTextArea
              textArea
              content={contentArticle}
              charCountArticle={charCountArticle}
              setContent={setContentArticle}
              cursorPosition={cursorPosition}
              setCursorPosition={setCursorPosition}
              setIsValidContent={setIsValidContent}
              //setSelectedFiles={setSelectedFiles}
              //selectedFiles={selectedFiles}
              setArrayTags={setArrayTags}
              maxLength={50000}
              arrayTags={arrayTags}
              //setFilePreviews={setFilePreviews}
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
                        !charCountArticle ||
                        !isValidContent ||
                        isError ||
                        !contentTitle
                          ? 'gray'
                          : 'white'
                      }
                    />
                  }
                  disabled={
                    !charCountArticle ||
                    !isValidContent ||
                    isError ||
                    !contentTitle
                  }
                  loading={sendingArticle}
                  onClick={
                    charCountArticle &&
                    isValidContent &&
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
  );
}
