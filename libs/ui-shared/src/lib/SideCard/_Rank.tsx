import { twMerge } from 'tailwind-merge';
import { PostUtil } from '../PostUtil';
import { Post } from '../Post';
import { Typography } from '../Typography';

interface RankProps extends React.HTMLAttributes<HTMLHeadingElement> {
  rank: number;
  tag: string | JSX.Element;
  color: string;
  counter?: React.ReactNode;
  images?: { alt: string; src: string }[];
  boxShadow?: boolean;
}
export const Rank = ({
  rank,
  tag,
  counter,
  color,
  images,
  boxShadow = true,
  ...rest
}: RankProps) => {
  const baseCSS = 'justify-start items-center gap-3 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <PostUtil.Tag boxShadow={boxShadow} clicked={false} color={color}>
        <div className="flex gap-2 items-center">
          {tag}
          <Typography.Caption variant="bold" className="text-opacity-50">
            {counter}
          </Typography.Caption>
        </div>
      </PostUtil.Tag>
      {/**{counter && <PostUtil.Counter counter={counter} />}*/}
      {images && <Post.UserPic images={images} />}
    </div>
  );
};
