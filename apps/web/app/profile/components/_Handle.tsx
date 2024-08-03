import { twMerge } from 'tailwind-merge';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useClientContext, useToastContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { Utils } from '@social/utils-shared';
import { DropDown } from '@/components/DropDown';
import { IExperienceComplete, TStatus } from '@/types';
import Tooltip from '@/components/Tooltip';

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string | JSX.Element;
  pubkey: string;
  creatorPubky?: string | null;
  status?: TStatus;
  experience?: IExperienceComplete;
  pic?: string;
}

export default function Handle({
  username,
  pubkey,
  creatorPubky,
  status,
  experience,
  pic,
  ...rest
}: HandleProps) {
  const { pubky, seed, follow, unfollow, listFollowers } = useClientContext();
  const { setContent, setShow } = useToastContext();
  const router = useRouter();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [showProfileCareer, setShowProfileCareer] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);

  const copyProfileUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${pubkey}`
      );
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`pk:${pubkey}`);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey = creatorPubky;

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followersList = await listFollowers(pubkey);

        if (followersList) {
          setInitLoadingFollowed(false);

          followersList.followers.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
            if (uri === pubky) {
              setFollowed(true);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followed, creatorPubky]);

  const followUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await follow(creatorPubky);
      setFollowed(result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await unfollow(creatorPubky);
      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

  const extractEmojiAndText = (status: string) => {
    const emojiRegex =
      /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(\p{Emoji_Modifier})?/gu;
    const emojiMatch = status.match(emojiRegex);
    if (emojiMatch) {
      const emoji = emojiMatch[0];
      const text = status.replace(emoji, '').trim();
      return { emoji, text };
    }
    return { emoji: '', text: status };
  };

  const { emoji, text } = status
    ? extractEmojiAndText(status)
    : { emoji: '', text: '' };

  return (
    <div {...rest} className={twMerge(rest.className)}>
      {username && pubkey ? (
        <>
          <Typography.Display className="text-left">
            {Utils.minifyText(username.toString(), 15)}
          </Typography.Display>
          <div className="-mt-4 inline-flex flex-row gap-3">
            {creatorPubky && (
              <>
                {initLoadingFollowed ? (
                  <Button.Large
                    loading={initLoadingFollowed}
                    className={
                      !creatorPubky || creatorPubky === pubky
                        ? 'hidden'
                        : 'w-auto h-8 px-3 py-2'
                    }
                  >
                    Loading
                  </Button.Large>
                ) : followed ? (
                  <Button.Large
                    onClick={loadingFollowed ? undefined : () => unfollowUser()}
                    disabled={loadingFollowed}
                    loading={loadingFollowed}
                    icon={<Icon.UserMinus size="16" />}
                    className={
                      !creatorPubky || creatorPubky === pubky
                        ? 'hidden'
                        : 'w-auto h-8 px-3 py-2'
                    }
                  >
                    Unfollow
                  </Button.Large>
                ) : (
                  <Button.Large
                    onClick={loadingFollowed ? undefined : () => followUser()}
                    disabled={loadingFollowed}
                    loading={loadingFollowed}
                    icon={<Icon.UserPlus size="16" />}
                    className={
                      !creatorPubky || creatorPubky === pubky
                        ? 'hidden'
                        : 'w-auto h-8 px-3 py-2'
                    }
                  >
                    Follow
                  </Button.Large>
                )}
              </>
            )}
            {(!creatorPubky || creatorPubky === pubky) && (
              <>
                <Button.Medium
                  className="px-3 w-21 h-8"
                  onClick={
                    disposableAccount
                      ? () => setShowModalLogout(true)
                      : () => router.push('/logout')
                  }
                  icon={<Icon.SignOut />}
                >
                  Sign out
                </Button.Medium>
                <Button.Medium
                  className="px-3 w-auto h-8"
                  onClick={() => router.push('/settings/edit')}
                  icon={<Icon.Pencil size="16" />}
                >
                  Edit
                </Button.Medium>
              </>
            )}
            <Button.Medium
              className="px-3 w-auto h-8"
              onClick={() => {
                setContent(`pk:${pubkey}`, 'pubky');
                setShow(true);
                copyToClipboard();
              }}
              icon={<Icon.Key size="16" />}
            >
              {Utils.minifyPubky(pubkey)}
            </Button.Medium>
            <Button.Medium
              className="px-3 w-auto h-8"
              onClick={() => {
                setContent(
                  `${window.location.origin}/profile/${pubkey}`,
                  'link'
                );
                setShow(true);
                copyProfileUrlToClipboard();
              }}
              icon={<Icon.Link size="16" />}
            >
              Link
            </Button.Medium>
            {experience && experience.experiences.length > 0 && (
              <Button.Action
                size="small"
                variant="custom"
                icon={<Icon.CV size="16" />}
                onClick={() => setShowProfileCareer(true)}
              />
            )}
            <div className="relative">
              {showProfileMenu && (
                <Tooltip.ProfileMenu
                  setShowProfileMenu={setShowProfileMenu}
                  creatorPubky={creatorPubky ?? pubkey}
                />
              )}
              <Button.Action
                size="small"
                variant="custom"
                icon={<Icon.DotsThreeOutline size="16" />}
                onClick={() => setShowProfileMenu(true)}
              />
            </div>
            {!creatorPubky || creatorPubky === pubky ? (
              <div className="flex flex-col gap-2">
                {status ? (
                  <DropDown.Status status={status} />
                ) : (
                  <Typography.Body className="text-opacity-50" variant="small">
                    Loading Status...
                  </Typography.Body>
                )}
              </div>
            ) : (
              status &&
              status !== 'noStatus' && (
                <Typography.Body variant="medium" className="mt-1">
                  {emoji && (
                    <>
                      {emoji} {text}
                    </>
                  )}
                  {!emoji && (
                    <>
                      {
                        Utils.statusHelper.emojis[
                          status as keyof typeof Utils.statusHelper.emojis
                        ]
                      }{' '}
                      {
                        Utils.statusHelper.labels[
                          status as keyof typeof Utils.statusHelper.labels
                        ]
                      }
                    </>
                  )}
                </Typography.Body>
              )
            )}
          </div>
        </>
      ) : (
        <Typography.Display className="text-left">
          Loading...
        </Typography.Display>
      )}
      <Modal.Logout
        showModalLogout={showModalLogout}
        setShowModalLogout={setShowModalLogout}
      />
      <Modal.ProfileCareer
        showModal={showProfileCareer}
        setShowModal={setShowProfileCareer}
        experience={experience}
        username={username}
        creatorPubky={creatorPubky}
        pic={pic}
      />
    </div>
  );
}
