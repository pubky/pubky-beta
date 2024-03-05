/* eslint-disable @next/next/no-img-element */
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function Avatar({
  username = 'user-pic',
  src,
  ...rest
}: AvatarProps) {
  return (
    <img
      alt={username}
      src={src}
      {...rest}
      className={twMerge('rounded-full w-[240px] h-[240px]', rest.className)}
    />
  );
}
