import { useModal } from '@/contexts';
import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { PubkyAppUserLink } from 'pubky-app-specs';
import { useState } from 'react';

interface LinksSectionProps {
  links: PubkyAppUserLink[];
}

export const socialLinks = [
  {
    name: 'X (twitter)',
    url: 'https://x.com/',
    icon: (
      <div>
        <Icon.Twitter size="16" />
      </div>
    )
  },
  {
    name: 'Telegram',
    url: 'https://t.me/',
    icon: (
      <div>
        <Icon.Telegram width="16" height="16" />
      </div>
    )
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/',
    icon: (
      <div>
        <Icon.Discord size="16" />
      </div>
    )
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/',
    icon: (
      <div>
        <Icon.Instagram size="16" />
      </div>
    )
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/',
    icon: (
      <div>
        <Icon.Facebook size="16" />
      </div>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/',
    icon: (
      <div>
        <Icon.LinkedIn size="16" />
      </div>
    )
  },
  {
    name: 'Github',
    url: 'https://github.com/',
    icon: (
      <div>
        <Icon.Github size="16" />
      </div>
    )
  },
  {
    name: 'Calendly',
    url: 'https://calendly.com/',
    icon: (
      <div>
        <Icon.Calendly size="16" />
      </div>
    )
  },
  {
    name: 'Medium',
    url: 'https://medium.com/',
    icon: (
      <div>
        <Icon.Medium size="16" />
      </div>
    )
  },
  {
    name: 'Youtube',
    url: 'https://youtube.com/',
    icon: (
      <div>
        <Icon.Youtube width="16" height="16" />
      </div>
    )
  },
  {
    name: 'Twitch',
    url: 'https://twitch.tv/',
    icon: (
      <div>
        <Icon.Twitch size="16" />
      </div>
    )
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/',
    icon: (
      <div>
        <Icon.TikTok size="16" />
      </div>
    )
  },
  {
    name: 'Spotify',
    url: 'https://spotify.com/user/',
    icon: (
      <div>
        <Icon.Spotify size="16" />
      </div>
    )
  }
];

const linkTitleToIconMap: { [key: string]: JSX.Element } = {
  email: (
    <div>
      <Icon.Envelope size="16" />
    </div>
  ),
  mail: (
    <div>
      <Icon.Envelope size="16" />
    </div>
  )
};

export default function LinksSection({ links }: LinksSectionProps) {
  const { openModal } = useModal();
  const checkLink = Utils.storage.get('checkLink') as boolean;
  const [clickedLink, setClickedLink] = useState('');

  const renderSocialUsername = (linkUrl: string) => {
    const cleanedUrl = linkUrl.endsWith('/') ? linkUrl.slice(0, -1) : linkUrl;

    const matchingSocialLink = socialLinks.find((socialLink) => cleanedUrl.includes(socialLink.url));

    if (matchingSocialLink) {
      const usernameStartIndex = cleanedUrl.lastIndexOf('/') + 1;
      const username = cleanedUrl.substring(usernameStartIndex);
      if (username) return username;
    }

    return removeUrlPrefix(cleanedUrl) || '';
  };

  const removeUrlPrefix = (url: string) => url.replace(/^(https?:\/\/(www\.)?|www\.)/, '');

  return (
    <>
      {links.length > 0 && (
        <div className="flex-col inline-flex gap-2">
          <SideCard.Header className="hidden lg:flex" title="Links" />
          <Typography.Body variant="large-bold" className="flex lg:hidden">
            Links
          </Typography.Body>
          <div className="flex-col inline-flex gap-2">
            {links.map((link, index) => {
              const icon = socialLinks.find((socialLink) => link.url.includes(socialLink.url))?.icon;
              const customIcon = linkTitleToIconMap[link.title.toLowerCase()];

              return (
                <div key={index} className="flex gap-2 items-center">
                  {link.url && (
                    <>
                      {customIcon ? (
                        customIcon
                      ) : icon ? (
                        icon
                      ) : (
                        <div>
                          <Icon.Link size="16" />
                        </div>
                      )}
                      {link.title.toLocaleLowerCase() === 'email' || link.title.toLocaleLowerCase() === 'mail' ? (
                        <Link href={`${link.url}`} target="_blank">
                          <Typography.Body
                            className="text-opacity-80 hover:text-opacity-100 break-words leading-none"
                            variant="medium"
                          >
                            {link.url.replace(/^mailto:/, '')}
                          </Typography.Body>
                        </Link>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={
                            checkLink === false
                              ? () => window.open(link.url, '_blank')
                              : () => {
                                  openModal('checkLink', { clickedLink: link.url });
                                  setClickedLink(link.url);
                                }
                          }
                        >
                          <Typography.Body
                            id={`profile-link-${link.title.toLowerCase()}`}
                            className="text-opacity-80 hover:text-opacity-100 break-words leading-none"
                            variant="medium"
                          >
                            {renderSocialUsername(link.url)}
                          </Typography.Body>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
