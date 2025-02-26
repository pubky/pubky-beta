'use client';

import { Links } from '@/types/Post';
import { Icon, Input, Modal, Typography, Button } from '@social/ui-shared';
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
  { name: 'Medium', url: 'https://medium.com/@' },
  { name: 'Youtube', url: 'https://youtube.com/@' },
  { name: 'Twitch', url: 'https://twitch.tv/' },
  { name: 'TikTok', url: 'https://tiktok.com/@' },
  { name: 'Spotify', url: 'https://spotify.com/user/' }
];

interface LinkProps {
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
  setLinks: any;
  links: Links[];
}

export default function ContentLink({ setShowModalLink, setLinks, links }: LinkProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [showHints, setShowHints] = useState(false);
  const disabled = !url || !title;

  const handleAddLink = () => {
    setLinks([...links, { title, url }]);
    setTitle('');
    setUrl('');
    setShowModalLink(false);
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

  const handleClipboardClick = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setUrl(text);
      })
      .catch((error) => {
        console.error('Failed to read clipboard contents: ', error);
      });
  };

  return (
    <>
      {showHints ? (
        <div className="flex flex-wrap gap-1.5 my-6">
          <div onClick={() => setShowHints(false)} className="pr-2 py-2 flex items-center cursor-pointer rounded-full">
            <Icon.ArrowLeft />
          </div>
          {socialLinks.map((socialData) => (
            <div
              key={socialData.name}
              className="px-4 py-2 bg-white bg-opacity-10 rounded-full cursor-pointer hover:bg-opacity-20"
              onClick={() => handleSocialClick(socialData)}
            >
              <Typography.Body variant="medium">{socialData.name}</Typography.Body>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="w-full my-6 flex-col inline-flex gap-4">
            <div>
              <Input.Label value="Label" />
              <Input.Text
                id="add-profile-link-label-input"
                placeholder="Add label"
                className="mt-1"
                value={title}
                onKeyDown={handleKeyDown}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                action={
                  <div onClick={() => setShowHints(true)} className="mt-2 cursor-pointer">
                    <Typography.Body variant="small-bold" className="text-white text-opacity-80 hover:text-white">
                      Hint
                    </Typography.Body>
                  </div>
                }
              />
            </div>
            <div>
              <Input.Label value="Url" />
              <Input.Text
                id="add-profile-link-url-input"
                placeholder="Add url"
                className="mt-1"
                value={url}
                onKeyDown={handleKeyDown}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                action={
                  <Button.Action
                    variant="custom"
                    size="small"
                    onClick={handleClipboardClick}
                    icon={<Icon.Clipboard size="20" />}
                  />
                }
              />
            </div>
          </div>
          <div className="w-full mt-4">
            <Modal.SubmitAction
              id="add-profile-link-submit-btn"
              icon={<Icon.LinkSimple size="16" color={disabled ? 'grey' : 'white'} />}
              onClick={!disabled ? handleAddLink : undefined}
              disabled={disabled}
            >
              Add link
            </Modal.SubmitAction>
          </div>
        </>
      )}
    </>
  );
}
