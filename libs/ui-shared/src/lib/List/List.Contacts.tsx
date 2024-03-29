import Image from 'next/image';
import { Typography } from '../Typography';
import { Content } from '../Content';

interface Contact extends React.HTMLAttributes<HTMLDivElement> {
  alt: string;
  src: string;
  name: string;
  handler: string;
}

type ContactsListProps = {
  contacts: Contact[];
};

export const Contacts = ({ contacts }: ContactsListProps) => {
  return (
    <>
      {contacts.map((contact, index) => (
        <div key={index}>
          <Content.Divider />
          <div className="justify-start items-center gap-4 inline-flex">
            <Image
              width={48}
              height={48}
              className="w-[48px] h-[48px] rounded-full overflow-hidden"
              src={contact.src}
              alt={contact.alt}
            />
            <div className="flex-col justify-start items-start inline-flex">
              <Typography.Body variant="medium-bold">
                {contact.name}
              </Typography.Body>
              <Typography.Caption className="text-neutral-400">
                {contact.handler}
              </Typography.Caption>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
