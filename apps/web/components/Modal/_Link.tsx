'use client';

import { Icon, Input, Modal, Typography } from '@social/ui-shared';
import { useState } from 'react';

const socialLinks = [
  { name: 'X (twitter)', url: 'https://x.com/@' },
  { name: 'Telegram', url: 'https://t.me/' },
  { name: 'Discord', url: 'https://discord.gg/' },
  { name: 'Instagram', url: 'https://instagram.com/@' },
  { name: 'Facebook', url: 'https://facebook.com/' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/' },
  { name: 'Github', url: 'https://github.com/' },
  { name: 'Calendly', url: 'https://calendly.com/' },
  { name: 'Vimeo', url: 'https://vimeo.com/' },
  { name: 'Youtube', url: 'https://youtube.com/@' },
  { name: 'Twitch', url: 'https://twitch.tv/' },
  { name: 'Pinterest', url: 'https://pinterest.com/' },
  { name: 'TikTok', url: 'https://tiktok.com/@' },
  { name: 'Spotify', url: 'https://spotify.com/user/' },
];

interface LinkProps {
  showModalLink: boolean;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
  modalLinkRef: React.RefObject<HTMLDivElement>;
  onAddLink: (title: string, url: string) => void;
}

export default function Link({
  showModalLink,
  setShowModalLink,
  modalLinkRef,
  onAddLink,
}: LinkProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [showHints, setShowHints] = useState(false);
  const disabled = !url || !title;

  const handleAddLink = () => {
    onAddLink(title, url);
    setShowModalLink(false);
    setTitle('');
    setUrl('');
  };

  const handleSocialClick = (socialData: { name: string; url: string }) => {
    setTitle(socialData.name);
    setUrl(socialData.url);
    setShowHints(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      handleAddLink();
    }
  };

  return (
    <Modal.Root
      show={showModalLink}
      closeModal={() => setShowModalLink(false)}
      modalRef={modalLinkRef}
      className="w-[592px] h-[480px] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModalLink(false)} />
      <Modal.Header title="Add Profile Link" />
      {showHints ? (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <div
            onClick={() => setShowHints(false)}
            className="pr-2 py-2 flex items-center cursor-pointer rounded-full"
          >
            <Icon.ArrowLeft />
          </div>
          {socialLinks.map((socialData) => (
            <div
              key={socialData.name}
              className="px-4 py-2 bg-white bg-opacity-10 rounded-full cursor-pointer hover:bg-opacity-20"
              onClick={() => handleSocialClick(socialData)}
            >
              <Typography.Body variant="medium">
                {socialData.name}
              </Typography.Body>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="my-6 flex-col inline-flex gap-4">
            <div>
              <Input.Label value="Label" />
              <Input.Text
                placeholder="Add label"
                className="mt-1"
                value={title}
                onKeyDown={handleKeyDown}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                action={
                  <div
                    onClick={() => setShowHints(true)}
                    className="cursor-pointer"
                  >
                    <Typography.Body
                      variant="small-bold"
                      className="text-fuchsia-500 text-opacity-80 hover:text-fuchsia-500"
                    >
                      Hint
                    </Typography.Body>
                  </div>
                }
              />
            </div>
            <div>
              <Input.Label value="Url" />
              <Input.Text
                placeholder="Add url"
                className="mt-1"
                value={url}
                onKeyDown={handleKeyDown}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
              />
            </div>
          </div>
          <div className="w-full mt-4">
            <Modal.SubmitAction
              icon={
                <Icon.LinkSimple
                  size="16"
                  color={disabled ? 'grey' : 'white'}
                />
              }
              onClick={!disabled ? handleAddLink : undefined}
              disabled={disabled}
            >
              Add link
            </Modal.SubmitAction>
          </div>
        </>
      )}
    </Modal.Root>
  );
}
