import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import Link from 'next/link';
import { Icon } from '../Icon';
import { ImageByUri } from '@components/ImageByUri/index';

interface UserSmallProps extends React.HTMLAttributes<HTMLDivElement> {
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
export const UserSmall = ({
  width = 32,
  height = 32,
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
}: UserSmallProps) => {
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
          <Typography.Body variant="small-bold">{username}</Typography.Body>
          {label ? (
            <Typography.Label className="text-[11px] text-opacity-50 leading-none">{label}</Typography.Label>
          ) : (
            <div className="flex gap-2 opacity-50 -mt-1">
              <div className="gap-1 flex items-center">
                <Icon.Tag size="12" />
                <Typography.Label className="text-[11px]">
                  {tagsCount && tagsCount > 0 ? tagsCount : 0}
                </Typography.Label>
              </div>
              <div className="gap-1 flex items-center">
                <Icon.NoteBlank size="12" />
                <Typography.Label className="text-[11px]">
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
