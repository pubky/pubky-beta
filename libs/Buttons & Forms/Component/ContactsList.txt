import { Typography } from '../Typography';
import { Divider } from './Divider';

type Contact = {
  image: string;
  name: string;
  slashUrl: string;
};

type ContactsListProps = {
  contacts: Contact[];
};

export const ContactsList = ({ contacts }: ContactsListProps) => {
  const shortSlashUrl = (slashUrl: string) => {
    const [, firstPart] = slashUrl.match(/slash:(.{5})/) || [];
    const [, lastPart] = slashUrl.match(/(.{5})\?relay=/) || [];
    return `${firstPart || ''}...${lastPart || ''}`;
  };
  return (
    <>
      {contacts.map((contact, index) => (
        <div key={index}>
          <Divider />
          <div className="justify-start items-center gap-4 inline-flex">
            <img
              className="bg-white rounded-full overflow-hidden w-12 h-12"
              src={contact.image}
              alt="Profile Image"
            />
            <div className="flex-col justify-start items-start gap-1 inline-flex">
              <Typography.Body variant="medium-bold">
                {contact.name}
              </Typography.Body>
              <Typography.Caption color="text-neutral-400">
                @{shortSlashUrl(contact.slashUrl)}
              </Typography.Caption>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
