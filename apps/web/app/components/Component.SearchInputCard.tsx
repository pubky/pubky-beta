import { Button, Card, Icon, PostUtil, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface SearchInputCardProps extends React.HTMLAttributes<HTMLDivElement> {
  refCard?: React.RefObject<HTMLDivElement>;
}

export default function SearchInputCard({
  refCard,
  ...rest
}: SearchInputCardProps) {
  return (
    <Card.Primary
      {...rest}
      refCard={refCard}
      className={twMerge('absolute top-16', rest.className)}
      background="bg-gradient-to-t from-[#07040a] to-[#1b1820]"
    >
      <div className="flex-col gap-6 inline-flex">
        <div>
          <Typography.Label className="text-opacity-30">
            Hot tags
          </Typography.Label>
          <div className="mt-2 justify-start items-start">
            <PostUtil.Tag clicked={false} color="amber" className="mr-2 my-1">
              #Bitcoin
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="amber" className="mr-2 my-1">
              #Satoshi
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="red" className="mr-2 my-1">
              #P2P
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="blue" className="mr-2 my-1">
              #Keys
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="blue" className="mr-2 my-1">
              #Scalability
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="green" className="mr-2 my-1">
              #Whitepaper
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="cyan" className="mr-2 my-1">
              #PoW
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="yellow" className="mr-2 my-1">
              #Cryptography
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="fuchsia" className="mr-2 my-1">
              #Quote
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="amber" className="mr-2 my-1">
              #Bitcointalk
            </PostUtil.Tag>
          </div>
        </div>
        <div>
          <Typography.Label className="text-opacity-30 font-medium">
            Emotag
          </Typography.Label>
          <div className="mt-2 gap-2 inline-flex">
            <PostUtil.Tag clicked={false} color="red">
              🔥
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="cyan">
              👀
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="purple">
              😂
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="yellow">
              👍
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="blue">
              ⭐
            </PostUtil.Tag>
            <PostUtil.Tag clicked={false} color="green">
              🙏
            </PostUtil.Tag>
            <Button.Action
              size="small"
              variant="custom"
              icon={<Icon.Smiley />}
            />
          </div>
        </div>
      </div>
    </Card.Primary>
  );
}
