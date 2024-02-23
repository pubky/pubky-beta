import Image from 'next/image';
import { Typography } from '../Typography';
import { Content } from '../Content';

interface ContactsProps extends React.HTMLAttributes<HTMLDivElement> {
  contacts: [
    {
      image: string;
      name: string;
      slashUrl: string;
    }
  ];
}

export const Contacts = ({ contacts }: ContactsProps) => {
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
            <div className="flex-col justify-start items-start inline-flex">
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
