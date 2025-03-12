import { Post, PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RankProps extends React.HTMLAttributes<HTMLDivElement> {
  tag: string;
  color: string;
  counter: string;
  boxShadow?: boolean;
}

export default function Rank({ tag, counter, color, boxShadow, ...rest }: RankProps) {
  const baseCSS = 'justify-start items-center gap-3 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <PostUtil.Tag boxShadow={boxShadow} clicked={false} color={color}>
        {tag}
      </PostUtil.Tag>
      <PostUtil.Counter className="w-full">
        {counter} {Number(counter) > 1 ? 'posts' : 'post'}
      </PostUtil.Counter>
    </div>
  );
}
