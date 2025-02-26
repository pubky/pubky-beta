import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { PostUtil } from '../PostUtil';
import Link from 'next/link';

interface SectionProps extends React.HTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  text: string;
  counter?: number;
  href: string;
}

export const Section = ({ href, icon, text, counter = 0, ...rest }: SectionProps) => {
  const baseCSS =
    'py-2.5 shadow border-b border-white border-opacity-10 justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10';
  return (
    <Link href={href} {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="items-center gap-2 flex">
        {icon}
        <Typography.Body variant="medium-bold">{text}</Typography.Body>
      </div>
      {counter && (
        <div>
          <PostUtil.Counter className="border-white border-opacity-100">{counter}</PostUtil.Counter>
        </div>
      )}
    </Link>
  );
};
