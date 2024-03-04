import { Post, PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RankProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: number;
  tag: string;
  color: string;
  counter: string;
  images?: { alt: string; src: string }[];
}

export default function Rank({
  rank,
  tag,
  counter,
  color,
  images,
  ...rest
}: RankProps) {
  const baseCSS = 'justify-start items-center gap-3 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <PostUtil.Counter counter={rank} />
      <PostUtil.Tag clicked={false} color={color}>
        {tag}
      </PostUtil.Tag>
      <PostUtil.Counter className="w-[87px]" counter={counter} />
      {images && <Post.UserPic images={images} />}
    </div>
  );
}
