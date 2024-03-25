import { twMerge } from 'tailwind-merge';
import { PostUtil } from '../PostUtil';
import { Post } from '../Post';

interface RankProps extends React.HTMLAttributes<HTMLHeadingElement> {
  rank: number;
  tag: string;
  color: string;
  counter: string;
  images?: { alt: string; src: string }[];
}
export const Rank = ({
  rank,
  tag,
  counter,
  color,
  images,
  ...rest
}: RankProps) => {
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
};
