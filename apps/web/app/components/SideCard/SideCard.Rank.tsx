import { PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RankProps extends React.HTMLAttributes<HTMLHeadingElement> {
  rank: number;
  tag: string;
  color: string;
  counter: string;
}
export const Rank = ({ rank, tag, counter, color, ...rest }: RankProps) => {
  const baseCSS = 'justify-start items-center gap-3 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <PostUtil.Counter counter={rank} />
      <PostUtil.Tag clicked={false} color={color}>
        {tag}
      </PostUtil.Tag>
      <PostUtil.Counter className="w-[87px]" counter={counter} />
    </div>
  );
};
