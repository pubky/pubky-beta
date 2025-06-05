import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import Link from 'next/link';
import { Icon } from '../Icon';
import { ImageByUri } from '@components/ImageByUri/index';

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  tagsCount?: number;
  postsCount?: number;
  username?: string | JSX.Element;
  alt?: string;
  width?: number;
  height?: number;
  image?: string;
  children?: React.ReactNode;
  uri: string;
  isCensored?: boolean;
}
export const User = ({
  width = 40,
  height = 40,
  image,
  alt = 'user',
  username,
  children,
  label,
  uri,
  tagsCount,
  postsCount,
  isCensored,
  ...rest
}: UserProps) => {
  return (
    <div {...rest} className={twMerge(`justify-between items-center inline-flex w-full`, rest.className)}>
      <Link href={`/profile/${uri}`} className="gap-2 inline-flex ">
        <ImageByUri
          id={uri}
          width={width}
          height={height}
          className="rounded-full max-w-none h-none"
          style={{ width: `${width}px`, height: `${height}px` }}
          alt={alt}
          isCensored={isCensored}
        />
        <div className="flex-col justify-start items-start inline-flex">
          <Typography.Body variant="medium-bold">{username}</Typography.Body>
          {label ? (
            <Typography.Label className="text-opacity-50 -mt-1">{label}</Typography.Label>
          ) : (
            <div className="flex gap-2 -mt-1">
              <div className="gap-1 flex items-center">
                <Icon.Tag size="14" color="gray" />
                <Typography.Label className="text-opacity-30">
                  {tagsCount && tagsCount > 0 ? tagsCount : 0}
                </Typography.Label>
              </div>
              <div className="gap-1 flex items-center">
                <Icon.NoteBlank size="14" color="gray" />
                <Typography.Label className="text-opacity-30">
                  {postsCount && postsCount > 0 ? postsCount : 0}
                </Typography.Label>
              </div>
            </div>
          )}
        </div>
      </Link>
      {children}
    </div>
  );
};
