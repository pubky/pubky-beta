import { twMerge } from 'tailwind-merge';
import { PostUtil } from '../PostUtil';
import { Post } from '../Post';
import { Typography } from '../Typography';
import Link from 'next/link';

interface RankProps extends React.HTMLAttributes<HTMLHeadingElement> {
  rank: number;
  tag: string | JSX.Element;
  color: string;
  counter?: React.ReactNode;
  boxShadow?: boolean;
  href?: string;
}
export const Rank = ({ rank, tag, counter, color, href, boxShadow = true, ...rest }: RankProps) => {
  const baseCSS = 'justify-start items-center gap-3 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Link href={href ?? ''}>
        <PostUtil.Tag boxShadow={boxShadow} clicked={false} color={color}>
          <div className="flex gap-2 items-center">
            {tag}
            <Typography.Caption variant="bold" className="text-opacity-50">
              {counter}
            </Typography.Caption>
          </div>
        </PostUtil.Tag>
      </Link>
    </div>
  );
};
