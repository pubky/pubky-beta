import Modal from '@/components/Modal';
import { Button, Card, Icon, Input } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

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

export default function Links({
  links,
  setLinks,
  errors,
  loading,
}: LinksProps) {
  const [showModalLink, setShowModalLink] = useState(false);
  const modalLinkRef = useRef<HTMLDivElement>(null);

  const handleAddLink = (title: string, url: string) => {
    setLinks([...links, { title, url }]);
    setShowModalLink(false);
  };

  const handleRemoveLink = (indexToRemove: number) => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedLinks;
    });
  };

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalLinkRef.current &&
        !modalLinkRef.current.contains(event.target as Node)
      ) {
        setShowModalLink(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalLinkRef, setShowModalLink]);

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
                disabled={loading}
                value={link.url.replace('mailto:', '')}
                error={errors[`link${index}` as keyof typeof errors]}
                action={
                  <div
                    className={`${
                      errors[`link${index}` as keyof typeof errors]
                        ? 'mt-0'
                        : 'mt-2'
                    } cursor-pointer`}
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
            icon={
              <Icon.LinkSimple
                size="16"
                color={links.length > 3 ? 'gray' : 'white'}
              />
            }
            onClick={
              links.length > 3 ? undefined : () => setShowModalLink(true)
            }
            disabled={links.length > 3}
          >
            Add link
          </Button.Transparent>
        </div>
        {showModalLink && (
          <Modal.Link
            showModalLink={showModalLink}
            setShowModalLink={setShowModalLink}
            modalLinkRef={modalLinkRef}
            onAddLink={handleAddLink}
          />
        )}
      </Card.Primary>
    </>
  );
}
