import Image from 'next/image';
import { Typography } from '../Typography';
import { Content } from '../Content';

type Contact = {
  image: string;
  name: string;
  slashUrl: string;
};

type ContactsListProps = {
  contacts: Contact[];
};

export const Contacts = ({ contacts }: ContactsListProps) => {
  const shortSlashUrl = (slashUrl: string) => {
    const [, firstPart] = slashUrl.match(/slash:(.{5})/) || [];
    const [, lastPart] = slashUrl.match(/(.{5})\?relay=/) || [];
    return `${firstPart || ''}...${lastPart || ''}`;
  };
  return (
    <>
      {contacts.map((contact, index) => (
        <div key={index}>
          <Content.Divider />
          <div className="justify-start items-center gap-4 inline-flex">
            <Image
              width={48}
              height={48}
              className="rounded-full overflow-hidden"
              src={contact.image}
              alt="Profile Image"
            />
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Body variant="medium-bold">
                {contact.name}
              </Typography.Body>
              <Typography.Caption className="text-neutral-400">
                @{shortSlashUrl(contact.slashUrl)}
              </Typography.Caption>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
