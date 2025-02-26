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

  return (
    <Card.Primary className="justify-start w-full col-span-3" title="Links">
      <div className="flex-col inline-flex gap-4 mt-4">
        {links.map((link, index) => (
          <div key={index}>
            <Input.Label value={link.title} />
            <Input.Text
              className="h-[70px] mt-2"
              placeholder={link.placeHolder}
              maxLength={50}
              disabled={loading}
              value={link.url.replace('mailto:', '')}
              error={errors[`link${index}` as keyof typeof errors]}
              action={
                index > 1 && (
                  <div className="mt-3 cursor-pointer" onClick={() => handleRemoveLink(index)}>
                    <Icon.Trash color="gray" />
                  </div>
                )
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
          className="w-[100px] mt-2 px-3 py-2 h-8"
          icon={<Icon.LinkSimple size="16" color={links.length > 3 ? 'gray' : 'white'} />}
          onClick={links.length > 3 ? undefined : () => openModal('link', { links: links, setLinks: setLinks })}
          disabled={links.length > 3}
        >
          Add link
        </Button.Transparent>
      </div>
    </Card.Primary>
  );
}
