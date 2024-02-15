import { Typography } from '../Typography';
import { Divider } from './Divider';

type Profile = {
  name: string;
  image?: string;
  slashUrl: string;
  info?: string;
  links?: {};
};

type ProfileinfoProps = {
  profile: Profile;
};

export const Profileinfo = ({ profile }: ProfileinfoProps) => {
  const { name, image, slashUrl, info, links } = profile;
  const linkKeys = links && (Object.keys(links) as Array<keyof typeof links>);
  const matches = slashUrl.match(/slash:(.{4}).*?(.{4})\?relay=/);
  const shortSlashUrl = matches ? `${matches[1]}...${matches[2]}` : '';

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="inline-grid gap-2 mr-auto">
          <Typography.Body variant="large-bold">{name}</Typography.Body>
          <Typography.Label color="text-white text-opacity-50">
            @{shortSlashUrl}
          </Typography.Label>
        </div>
        <img
          className="bg-white rounded-full overflow-hidden w-16 h-16"
          src={image}
          alt="Profile Image"
        />
      </div>
      <div className="mt-8">
        <Typography.Body
          color="text-white text-opacity-80"
          styles="w-80"
          variant="medium-light"
        >
          {info}
        </Typography.Body>
      </div>
      <Divider />
      {linkKeys &&
        linkKeys.map((key, index) => (
          <div key={key}>
            <Typography.Label color="text-white text-opacity-50">
              {key}
            </Typography.Label>
            <Typography.Body
              variant="medium"
              color="text-white text-opacity-80"
            >
              {links[key]}
            </Typography.Body>
            {index !== linkKeys.length - 1 && <Divider />}
          </div>
        ))}
    </div>
  );
};
