import { ImageByUri } from '@/components/ImageByUri';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  uriImage: string | undefined;
  alt?: string;
  status?: string;
}

export default function Avatar({ username = 'user-pic', uriImage, status, ...rest }: AvatarProps) {
  return (
    <div {...rest} className={rest.className}>
      <ImageByUri
        alt={username}
        width={136}
        height={136}
        className={'rounded-full w-16 h-16 md:w-[136px] md:h-[136px]'}
        uri={uriImage}
      />
      <div className="absolute right-0 top-36 text-[110px]">{status}</div>
    </div>
  );
}
