import { Button, Icon, Input } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';
import { searchUsersById, searchUsersByName } from '@/services/streamService';
import { getUserProfile } from '@/services/userService';
import { Section } from '@/components/CreateContent/Section';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PostView } from '@/types/Post';

interface CreateEditArticleProps {
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentEditArticle({ setShowModalEditArticle, article, setShowMenu }: CreateEditArticleProps) {
  const { editArticle, pubky, profile } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const articleContent = article?.details?.content ? JSON.parse(article?.details?.content) : { title: '', body: '' };
  const [isError, setIsError] = useState(false);
  const [contentTitle, setContentTitle] = useState(articleContent?.title || '');
  const [contentArticle, setContentArticle] = useState(articleContent?.body || '');
  const [charCountArticle, setCharCountArticle] = useState(articleContent?.body?.length || 0);
  const [sendingArticle, setSendingArticle] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPlaceholder(Utils.promptPlaceholder('article'));
  }, []);

  const handleSubmit = async (content: string) => {
    if (sendingArticle) {
      return;
    }
    try {
      setSendingArticle(true);

      const editArticleUri = await editArticle(article.details.id, contentTitle, content);

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
      setContentArticle('');
      setShowModalEditArticle(false);
    } catch (error) {
      console.log(error);
      addAlert('Something wrong. Try again', 'warning');
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
              maxLength={40000}
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
