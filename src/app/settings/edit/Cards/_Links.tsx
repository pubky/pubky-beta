import { socialLinks } from '@/app/profile/components/Sidebar/_LinksSection';
import { useModal } from '@/contexts';
import { Button, Card, Icon, Input } from '@social/ui-shared';

interface Errors {
  name: string;
  bio: string;
}

interface Link {
  title: string;
  url: string;
  placeHolder?: string;
}

interface LinksProps {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
  errors: Errors;
  loading?: boolean;
}

export default function Links({ links, setLinks, errors, loading }: LinksProps) {
  const { openModal } = useModal();

  const handleRemoveLink = (indexToRemove: number) => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks.filter((_, index) => index !== indexToRemove);
      return updatedLinks;
    });
  };

  const extractUsername = (url: string): string => {
    const matchedSocial = socialLinks.find((social) => url.startsWith(social.url));
    if (matchedSocial) {
      return url.replace(matchedSocial.url, '');
    }
    return url;
  };

  return (
    <>
      <Card.Primary className="justify-start w-full col-span-3" title="Links">
        <div className="flex-col inline-flex gap-4 mt-4">
          {links.map((link, index) => (
            <div key={index}>
              <Input.Label value={link.title} />
              <Input.Text
                id={`edit-profile-link-${link.title.toLowerCase()}-input`}
                className="h-[70px] mt-2"
                placeholder={link.placeHolder}
                maxLength={50}
                disabled={loading}
                value={extractUsername(link.url).replace('mailto:', '')}
                error={errors[`link${index}` as keyof typeof errors]}
                action={
                  <div
                    className={`${errors[`link${index}` as keyof typeof errors] ? 'mt-0' : 'mt-2'} cursor-pointer`}
                    onClick={() => handleRemoveLink(index)}
                  >
                    <Icon.Trash color="gray" />
                  </div>
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedLinks = [...links];
                  updatedLinks[index].url = e.target.value;
                  setLinks(updatedLinks);
                }}
              />
            </div>
          ))}
          <Button.Transparent
            id="edit-profile-add-link-btn"
            className="w-[100px] mt-2 px-3 py-2 h-8"
            icon={<Icon.LinkSimple size="16" color={links.length > 3 ? 'gray' : 'white'} />}
            onClick={links.length > 3 ? undefined : () => openModal('link', { links: links, setLinks: setLinks })}
            disabled={links.length > 3}
          >
            Add link
          </Button.Transparent>
        </div>
      </Card.Primary>
    </>
  );
}
