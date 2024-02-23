import Image from 'next/image';
import { Typography } from '../Typography';
import { Content } from '.';

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  profile: {
    name: string;
    image: string;
    slashUrl: string;
    info?: string;
    links?: {
      email?: string;
      website?: string;
      x?: string;
    };
  };
}

export const Profile = ({ profile }: ProfileProps) => {
  const { name, image, slashUrl, info, links } = profile;
  const linkKeys = links && (Object.keys(links) as Array<keyof typeof links>);
  const matches = slashUrl.match(/slash:(.{4}).*?(.{4})\?relay=/);
  const shortSlashUrl = matches ? `${matches[1]}...${matches[2]}` : '';

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="inline-grid gap-2 mr-auto">
          <Typography.Body variant="large-bold">{name}</Typography.Body>
          <Typography.Label className="text-opacity-50">
            @{shortSlashUrl}
          </Typography.Label>
        </div>
        <Image
          width={64}
          height={64}
          className="rounded-full overflow-hidden"
          src={image}
          alt="Profile Image"
        />
      </div>
      <div className="mt-8">
        <Typography.Body
          className="w-80 text-opacity-80"
          variant="medium-light"
        >
          {info}
        </Typography.Body>
      </div>
      <Content.Divider />
      {linkKeys &&
        linkKeys.map((key, index) => (
          <div key={key}>
            <Typography.Label className="text-opacity-50">
              {key}
            </Typography.Label>
            <Typography.Body variant="medium" className="text-opacity-80">
              {links[key]}
            </Typography.Body>
            {index !== linkKeys.length - 1 && <Content.Divider />}
          </div>
        ))}
    </div>
  );
};
