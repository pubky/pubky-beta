import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  label: string;
  username: string;
  alt?: string;
  width?: number;
  height?: number;
  image?: string;
  children?: React.ReactNode;
}
export const User = ({
  width = 48,
  height = 48,
  image,
  alt = 'user',
  src,
  username,
  children,
  label,
  ...rest
}: UserProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `justify-between items-center inline-flex`,
        rest.className
      )}
    >
      <div className="gap-4 inline-flex">
        <Image
          width={width}
          height={height}
          className="rounded-full"
          alt={alt}
          src={src}
        />
        <div className="flex-col justify-start items-start gap-1 inline-flex">
          <Typography.Label className="text-opacity-30 -mb-1">
            {label}
          </Typography.Label>
          <Typography.Body variant="medium-bold">{username}</Typography.Body>
        </div>
      </div>
      {children}
    </div>
  );
};
