import React from 'react';

interface Profile {
  name: string;
  image?: string;
  slashUrl: string;
  info?: string;
  links?: {};
}

interface ProfileInfoProps {
  profile: Profile;
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const { name, image, slashUrl, info, links } = profile;
  const linkKeys = links && (Object.keys(links) as Array<keyof typeof links>);
  const firstLettersSlashUrl = slashUrl.match(/slash:(.{4})/);
  const firstPartSlashUrl = firstLettersSlashUrl ? firstLettersSlashUrl[1] : '';
  const lastLettersSlashUrl = slashUrl.match(/(.{4})\?relay=/);
  const lastPartSlashUrl = lastLettersSlashUrl ? lastLettersSlashUrl[1] : '';
  const shortSlashurl = `${firstPartSlashUrl}...${lastPartSlashUrl}`;

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="mr-auto">
          <p className="font-inter-tight text-2xl font-semibold leading-[30px] tracking-[0.6px] text-white mb-2">
            {name}
          </p>
          <p className="font-inter-tight text-[13px] uppercase leading-[16px] tracking-[1px] text-white opacity-[0.5] font-semibold">
            @{shortSlashurl}
          </p>
        </div>
        <div className="bg-gray-100 rounded-full overflow-hidden w-[64px] h-[64px] flex-shrink-0">
          <img
            src={image}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="mt-8">
        <p className="font-inter-tight w-[300px] font-light text-[17px] leading-[25px] tracking-[-0.1px] text-white opacity-[0.8]">
          {info}
        </p>
      </div>
      <div className="border-t border border-white opacity-[0.1] my-6"></div>
      {linkKeys &&
        linkKeys.map((key, index) => (
          <div key={key} className="mt-4">
            <p className="font-inter-tight uppercase font-medium text-[13px] leading-[18px] tracking-[0.8px] text-white opacity-[0.5] mb-1">
              {key}
            </p>
            <p className="font-inter-tight font-normal text-[17px] leading-[25px] tracking-[-0.1px] text-white opacity-[0.8]">
              {links[key]}
            </p>
            {index !== linkKeys.length - 1 && (
              <div className="border-t border border-white opacity-[0.1] my-6"></div>
            )}
          </div>
        ))}
    </div>
  );
};
