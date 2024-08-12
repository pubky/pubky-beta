import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

interface LinksSectionProps {
  links: { title: string; url: string }[];
  checkLink: boolean;
  setShowModalCheckLink: (show: boolean) => void;
  setClickedLink: (link: string) => void;
}

const socialLinks = [
  {
    name: 'X (twitter)',
    url: 'https://x.com/@',
    icon: <Icon.Twitter size="16" />,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/',
    icon: <Icon.Telegram width="16" height="16" />,
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/',
    icon: <Icon.Discord size="16" />,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/@',
    icon: <Icon.Instagram size="16" />,
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/',
    icon: <Icon.Facebook size="16" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/',
    icon: <Icon.LinkedIn size="16" />,
  },
  {
    name: 'Github',
    url: 'https://github.com/',
    icon: <Icon.Github size="16" />,
  },
  {
    name: 'Calendly',
    url: 'https://calendly.com/',
    icon: <Icon.Calendly size="16" />,
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@',
    icon: <Icon.Medium size="16" />,
  },
  {
    name: 'Youtube',
    url: 'https://youtube.com/@',
    icon: <Icon.Youtube width="16" height="16" />,
  },
  {
    name: 'Twitch',
    url: 'https://twitch.tv/',
    icon: <Icon.Twitch size="16" />,
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@',
    icon: <Icon.TikTok size="16" />,
  },
  {
    name: 'Spotify',
    url: 'https://spotify.com/user/',
    icon: <Icon.Spotify size="16" />,
  },
];

const linkTitleToIconMap: { [key: string]: JSX.Element } = {
  email: <Icon.Envelope size="16" />,
  mail: <Icon.Envelope size="16" />,
};

export default function LinksSection({
  links,
  checkLink,
  setShowModalCheckLink,
  setClickedLink,
}: LinksSectionProps) {
  const renderSocialUsername = (linkUrl: string) => {
    const matchingSocialLink = socialLinks.find((socialLink) =>
      linkUrl.includes(socialLink.url)
    );

    if (matchingSocialLink) {
      const usernameStartIndex = linkUrl.lastIndexOf('/') + 1;
      const username = linkUrl.substring(usernameStartIndex);
      if (username) return username;
    }

    return linkUrl || '';
  };
  return (
    <>
      {links.length > 0 && (
        <div className="flex-col inline-flex gap-2">
          <SideCard.Header title="Links" />
          <div className="flex-col inline-flex gap-2">
            {links.map((link, index) => {
              const icon = socialLinks.find((socialLink) =>
                link.url.includes(socialLink.url)
              )?.icon;
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
                        <Icon.Link size="16" />
                      )}
                      {link.title.toLocaleLowerCase() === 'email' ||
                      link.title.toLocaleLowerCase() === 'mail' ? (
                        <Link href={`mailto:${link.url}`} target="_blank">
                          <Typography.Body
                            className="text-opacity-80 hover:text-opacity-100"
                            variant="small"
                          >
                            {link.url}
                          </Typography.Body>
                        </Link>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={
                            checkLink === false
                              ? () => window.open(link.url, '_blank')
                              : () => {
                                  setShowModalCheckLink(true);
                                  setClickedLink(link.url);
                                }
                          }
                        >
                          <Typography.Body
                            className="text-opacity-80 hover:text-opacity-100"
                            variant="small"
                          >
                            {Utils.minifyText(
                              renderSocialUsername(link.url),
                              50
                            )}
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
