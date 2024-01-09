import React from 'react';

interface Contact {
  image: string;
  name: string;
  slashUrl: string;
}

interface ContactsListProps {
  contacts: Contact[];
}

export const ContactsList = ({ contacts }: ContactsListProps) => {
  const shortenSlashUrl = (slashUrl: string) => {
    const firstLettersSlashUrl = slashUrl.match(/slash:(.{5})/);
    const firstPartSlashUrl = firstLettersSlashUrl
      ? firstLettersSlashUrl[1]
      : '';
    const lastLettersSlashUrl = slashUrl.match(/(.{5})\?relay=/);
    const lastPartSlashUrl = lastLettersSlashUrl ? lastLettersSlashUrl[1] : '';
    return `${firstPartSlashUrl}...${lastPartSlashUrl}`;
  };
  return (
    <div>
      {contacts.map((contact, index) => (
        <div key={index}>
          <div className="border-t border border-white opacity-[0.1] my-6"></div>
          <div className="flex items-center justify-start">
            <div className="bg-gray-100 rounded-full overflow-hidden w-[48px] h-[48px] flex-shrink-0">
              <img
                src={contact.image}
                alt={`Contact ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="font-inter-tight text-[17px] font-semibold leading-[22px] tracking-[0.4px] text-white mb-1">
                {contact.name}
              </p>
              <p className="font-inter-tight text-[13px] leading-[18px] tracking-[0.4px] text-[#8E8E93] font-normal">
                @{shortenSlashUrl(contact.slashUrl)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
