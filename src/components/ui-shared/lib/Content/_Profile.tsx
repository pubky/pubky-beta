import { Typography } from '../Typography';
import { Content } from '.';
import { ImageByUri } from '@/components/ImageByUri/index';

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  profile: {
    name: string | JSX.Element;
    image: string;
    handler: string;
    bio?: string;
    links?: {
      email?: string;
      website?: string;
      x?: string;
      telegram?: string;
    };
  };
}

export const Profile = ({ profile }: ProfileProps) => {
  const { name, image, handler, bio, links } = profile;
  const linkKeys = links && (Object.keys(links) as Array<keyof typeof links>);

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="inline-grid gap-2 mr-auto">
          <Typography.Body variant="large-bold">{name}</Typography.Body>
          <Typography.Label className="text-opacity-50">{handler}</Typography.Label>
        </div>
        <ImageByUri
          id={handler}
          width={64}
          height={64}
          className="w-[64px] h-[64px] rounded-full overflow-hidden"
          alt="Profile Image"
        />
      </div>
      <Typography.Body className="text-opacity-80 mt-8 break-words" variant="medium-light">
        {bio}
      </Typography.Body>
      <Content.Divider />
      {linkKeys &&
        linkKeys.map((key, index) => (
          <div key={key}>
            {links[key] && (
              <>
                <Typography.Label className="text-opacity-50">{key}</Typography.Label>
                <Typography.Body variant="medium" className="break-words w-44 text-opacity-80 sm:w-full">
                  {links[key]}
                </Typography.Body>
                {index !== linkKeys.length - 1 && <Content.Divider />}
              </>
            )}
          </div>
        ))}
    </div>
  );
};
