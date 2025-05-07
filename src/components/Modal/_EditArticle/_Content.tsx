import { Button, Icon, Input, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';
import { useStreamSearchUsersByUsername } from '@/hooks/useStream';
import { Section } from '@/components/CreateContent/Section';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PostView } from '@/types/Post';

interface CreateEditArticleProps {
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentEditArticle({ setShowModalEditArticle, article, setShowMenu }: CreateEditArticleProps) {
  const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
  const BASE_URL = `${NEXT_PUBLIC_NEXUS}/static/files`;
  const { editArticle, pubky, profile } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const articleContent = article?.details?.content ? JSON.parse(article?.details?.content) : { title: '', body: '' };
  const file = article?.details?.attachments[0];

  // Extract pubky path and file ID from the file URL
  const pubkyId = file?.split('pubky://')[1]?.split('/pub/')[0];
  const fileId = file?.split('/pub/pubky.app/files/')[1];
  const pubkyPath = pubkyId && fileId ? `${pubkyId}/${fileId}` : null;
  const fileArticle = pubkyPath ? `${BASE_URL}/${pubkyPath}/main` : null;

  const [isError, setIsError] = useState(false);
  const [contentTitle, setContentTitle] = useState(articleContent?.title || '');
  const [contentArticle, setContentArticle] = useState(articleContent?.body || '');
  const [charCountArticle, setCharCountArticle] = useState(articleContent?.body?.length || 0);
  const [arrayTags, setArrayTags] = useState<string[]>(article?.tags?.map((tag) => tag.label) || []);
  const [sendingArticle, setSendingArticle] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(fileArticle || null);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorFile, setErrorFile] = useState('');
  const [hasImageChanged, setHasImageChanged] = useState(false);

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

      // If the image has changed and there's no new image selected, we should delete the old image
      if (hasImageChanged && !selectedFile.length && fileArticle) {
        // Here you would add the logic to delete the old image
        // This depends on your backend implementation
        console.log('Deleting old image:', fileArticle);
      }

      const editArticleUri = await editArticle(article.details.id, contentTitle, content, selectedFile, updatedTags);

      if (editArticleUri) {
        addAlert(
          <>
            Article edited!{' '}
            <a className="text-[#c8ff00] font-bold hover:text-opacity-90" href={Utils.encodePostUri(editArticleUri)}>
              View
            </a>
          </>
        );
      } else {
        addAlert('Something went wrong. Try again', 'warning');
      }
      setArrayTags([]);
      setContentArticle('');
      setShowModalEditArticle(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingArticle(false);
      setShowMenu(false);
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
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      setHasImageChanged(true);
    }
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile([]);
    setFilePreview(null);
    setHasImageChanged(true);
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

      const newFiles = selectedFile && validFiles.slice(0, 3 - selectedFile.length);
      //const newPreviews =
      // newFiles && newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFile && newFiles && setSelectedFile((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
      //newPreviews &&
      // setFilePreviews((prevPreviews) =>
      //   [...prevPreviews, ...newPreviews].slice(0, 3)
      // );
    }
  };

  return (
    <div className="flex items-center relative">
      <div className="w-full">
        <div className="w-full rounded-lg flex-col justify-start items-start inline-flex">
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
                {filePreview ? (
                  <div className="relative">
                    <div
                      onClick={removeFile}
                      className="z-10 cursor-pointer absolute top-2.5 right-2.5 w-10 h-10 p-3 bg-[#05050a] bg-opacity-50 hover:bg-opacity-30 rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex"
                    >
                      <Icon.Trash size="20" />
                    </div>
                    <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                      <Image
                        src={filePreview}
                        alt="Article Preview"
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
              noEmoji
              noFile
              button={
                <Button.Medium
                  id="post-btn"
                  className="w-auto"
                  variant="line"
                  icon={
                    <Icon.PencilLine
                      size="16"
                      color={!charCountArticle || !isValidContent || isError || !contentTitle ? 'gray' : 'white'}
                    />
                  }
                  disabled={!charCountArticle || !isValidContent || isError || !contentTitle}
                  loading={sendingArticle}
                  onClick={
                    charCountArticle && isValidContent && contentTitle && !isError && !sendingArticle
                      ? () => handleSubmit(contentArticle)
                      : undefined
                  }
                >
                  Edit
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
