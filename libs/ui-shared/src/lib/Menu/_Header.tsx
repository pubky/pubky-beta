import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { ImageByUri } from '../../../../../apps/web/components/ImageByUri/index';

interface HeaderProps extends React.HTMLAttributes<HTMLAnchorElement> {
  uriImage: string;
  username: string | JSX.Element;
  handler?: string;
  width?: number;
  height?: number;
  alt?: string;
  href?: string;
}

export const Header = ({
  uriImage,
  username,
  handler,
  width = 96,
  height = 96,
  alt = 'user-pic',
  ...rest
}: HeaderProps) => {
  return (
    <a {...rest} className={twMerge('flex-col gap-4 flex', rest.className)}>
      <ImageByUri
        width={width}
        height={height}
        alt={alt}
        uri={uriImage}
        className="rounded-full w-[96px] h-[96px]"
      />
      <div className="flex-col flex">
        <Typography.PageTitle className="font-bold leading-[30px]">
          {username}
        </Typography.PageTitle>
        <div className="items-center gap-1 inline-flex">
          <Typography.Label className="text-opacity-50">
            {handler}
          </Typography.Label>
        </div>
      </div>
    </a>
  );
};
