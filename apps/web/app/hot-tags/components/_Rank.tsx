import { Post, PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RankProps extends React.HTMLAttributes<HTMLDivElement> {
  tag: string;
  color: string;
  counter: string;
  images?: { alt: string; src: string }[];
}

export default function Rank({
  tag,
  counter,
  color,
  images,
  ...rest
}: RankProps) {
  const baseCSS = 'justify-start items-center gap-3 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <PostUtil.Tag clicked={false} color={color}>
        {tag}
      </PostUtil.Tag>
      <PostUtil.Counter className="w-full">{counter} posts</PostUtil.Counter>
      {images && (
        <Post.UserPic className="hidden sm:inline-flex" images={images} />
      )}
    </div>
  );
}
