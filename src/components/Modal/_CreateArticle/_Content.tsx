import { Button, Icon, Input, Typography } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';
import Image from 'next/image';
import { searchUsersById, searchUsersByName } from '@/services/streamService';
import { getUserProfile } from '@/services/userService';
import { Section } from '@/components/CreateContent/Section';
import { useIsMobile } from '@/hooks/useIsMobile';

interface CreateArticleProps {
  setShowModalArticle: React.Dispatch<React.SetStateAction<boolean>>;
  setHasContent: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentCreateArticle({
  setShowModalArticle,
  setHasContent,
  setShowModalPost
}: CreateArticleProps) {
  const { pubky, createArticle, profile } = usePubkyClientContext();
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  const [isError, setIsError] = useState(false);
  const { addAlert, removeAlert } = useAlertContext();
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
  const [isCompressing, setIsCompressing] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);

  useEffect(() => {
    setHasContent(charCountArticle > 0 || contentTitle.length > 0 || selectedFile.length > 0 || arrayTags.length > 0);
  }, [charCountArticle, contentTitle, selectedFile, arrayTags]);

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
      const filteredHashtags = hashtags.filter((tag) => tag.length <= 20);
      const updatedTags = [...new Set([...arrayTags, ...filteredHashtags])];

      const newArticle = await createArticle(contentTitle, content, selectedFile, updatedTags);

      if (newArticle) {
        addAlert(
          <>
            Article created!{' '}
            <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(newArticle?.uri)}>
              View
            </a>
          </>
        );
        setArrayTags([]);
        setContentArticle('');
        setShowModalPost && setShowModalPost(false);
        setShowModalArticle(false);
        setSelectedFile([]);
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
      addAlert('Something wrong. Try again', 'warning');
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

    // Remove HTML tags from search queries
    const cleanSearchQueries = searchQueries
      .map((query) => query.replace(/<[^>]*>/g, ''))
      .filter((query) => query.trim().length > 0);

    if (cleanSearchQueries.length === 0) {
      setSearchedUsers([]);
      return;
    }

    let allUserIds: string[] = [];

    for (const query of cleanSearchQueries) {
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxImageSizeInMB = 5;
    const maxOtherSizeInMB = 20;
    const maxImageSizeInBytes = maxImageSizeInMB * 1024 * 1024;
    const maxOtherSizeInBytes = maxOtherSizeInMB * 1024 * 1024;

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
        setErrorFile('File type not supported.');
        return;
      }

      let processedFile = file;

      if (isImage && file.size > maxImageSizeInBytes) {
        try {
          const loadingAlertId = addAlert('Compressing image...', 'loading');
          setIsCompressing(true);
          processedFile = await Utils.resizeImageFile(file, maxImageSizeInBytes);
          removeAlert(loadingAlertId);
          setIsCompressing(false);
        } catch (error) {
          setErrorFile('The maximum allowed size for images is 5 MB');
          return;
        }
      } else if (!isImage && file.size > maxOtherSizeInBytes) {
        setErrorFile('The maximum allowed size is 20 MB');
        return;
      }

      setSelectedFile([processedFile]);
      const previewUrl = URL.createObjectURL(processedFile);
      setFilePreview(previewUrl);
    }
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile([]);
    setFilePreview(null);
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

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const maxImageSizeInMB = 5;
    const maxOtherSizeInMB = 20;
    const maxImageSizeInBytes = maxImageSizeInMB * 1024 * 1024;
    const maxOtherSizeInBytes = maxOtherSizeInMB * 1024 * 1024;

    if (files) {
      // Check if we already have a file
      if (selectedFile.length >= 1) {
        addAlert('Only one file can be uploaded.', 'warning');
        return;
      }

      const processFiles = async () => {
        const file = files[0]; // Only process the first file

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
          return;
        }

        let processedFile = file;

        if (isImage && file.size > maxImageSizeInBytes) {
          try {
            const loadingAlertId = addAlert('Compressing image...', 'loading');
            setIsCompressing(true);
            processedFile = await Utils.resizeImageFile(file, maxImageSizeInBytes);
            removeAlert(loadingAlertId);
            setIsCompressing(false);
          } catch (error) {
            addAlert('The maximum allowed size for images is 5 MB', 'warning');
            return;
          }
        } else if (!isImage && file.size > maxOtherSizeInBytes) {
          addAlert('The maximum allowed size is 20 MB', 'warning');
          return;
        }

        setSelectedFile([processedFile]);
        const previewUrl = URL.createObjectURL(processedFile);
        setFilePreview(previewUrl);
      };

      await processFiles();
    }
  };

  return (
    <div className="flex items-center relative">
      <div className="w-full">
        <div
          //id={`${id}`}
          className="w-full rounded-lg flex-col justify-start items-start inline-flex"
        >
          <div ref={wrapperRef} className="w-full flex justify-between gap-3 items-start flex-col">
            <div className="w-full">
              <Input.Cursor
                id="article-title-input"
                placeholder="Article Title"
                autoFocus
                className="h-auto text-[40px] font-bold sm:text-[64px]"
                defaultValue={contentTitle}
                disabled={sendingArticle}
                maxLength={50}
                autoCorrect="off"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContentTitle(e.target.value)}
              />
              <Section.UserArea
                name={profile?.name ?? Utils.minifyPubky(pubky ?? '')}
                warningLink
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
                        src={filePreview || ''}
                        alt="Uploaded Preview"
                        className="w-[1200px] rounded-lg"
                        width={1000}
                        height={650}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    id="media-upload-btn"
                    onClick={handleFileClick}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="flex flex-col justify-center items-center h-[216px] min-w-[200px] bg-white bg-opacity-10 rounded-lg p-4 cursor-pointer"
                  >
                    <input
                      id="fileInput"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className={`${isDragging && selectedFile ? 'opacity-100' : 'opacity-30'} hover:opacity-100`}>
                      <div className="w-12 h-12 bg-white/10 rounded-[48px] backdrop-blur-[10px] flex items-center justify-center justify-self-center">
                        <Icon.Plus size="26" color="white" />
                      </div>
                      <p className="mt-2 text-white text-base text-center">Add image</p>
                    </div>
                    <Typography.Body className="text-red-500 mt-4" variant="small">
                      {errorFile}
                    </Typography.Body>
                  </div>
                )}
              </div>
              <Section.InputArea
                id="article-content-input"
                content={contentArticle}
                className="mt-[6px]"
                setContent={setContentArticle}
                searchedUsers={searchedUsers}
                setSearchedUsers={setSearchedUsers}
                setCursorPosition={setCursorPosition}
                maxLength={40000}
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
              setArrayTags={setArrayTags}
              maxLength={40000}
              arrayTags={arrayTags}
              showEmojis={showEmojis}
              setShowEmojis={setShowEmojis}
              largeView={!isMobile}
              isError={isError}
              noEmoji
              noFile
              button={
                <Button.Medium
                  id="post-btn"
                  className="w-auto"
                  variant="line"
                  icon={
                    <Icon.PaperPlaneRight
                      color={
                        !charCountArticle || !isValidContent || isError || !contentTitle || isCompressing
                          ? 'gray'
                          : 'white'
                      }
                    />
                  }
                  disabled={!charCountArticle || !isValidContent || isError || !contentTitle || isCompressing}
                  loading={sendingArticle}
                  onClick={
                    charCountArticle && isValidContent && contentTitle && !isError && !sendingArticle && !isCompressing
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
