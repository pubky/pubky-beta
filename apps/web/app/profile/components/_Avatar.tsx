/* eslint-disable @next/next/no-img-element */

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  src: string;
  alt?: string;
  status?: string;
}

export default function Avatar({
  username = 'user-pic',
  src,
  status,
  ...rest
}: AvatarProps) {
  return (
    <div {...rest} className={rest.className}>
      <img alt={username} src={src} className={'rounded-full w-32 h-32'} />
      <div className="absolute right-0 top-36 text-[110px]">{status}</div>
    </div>
  );
}
