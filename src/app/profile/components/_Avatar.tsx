import { ImageByUri } from '@/components/ImageByUri';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  username?: string;
  alt?: string;
  status?: string;
  isCensored?: boolean;
}

export default function Avatar({ id, username = 'user-pic', status, isCensored, ...rest }: AvatarProps) {
  return (
    <div {...rest} className={rest.className}>
      <ImageByUri
        id={id}
        isCensored={isCensored}
        alt={username}
        width={136}
        height={136}
        className={'rounded-full w-16 h-full md:w-[136px]'}
      />
      <div className="absolute right-0 top-36 text-[110px]">{status}</div>
    </div>
  );
}
