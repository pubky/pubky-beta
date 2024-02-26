import { Button, Card, Icon, Post, Typography } from '@social/ui-shared';
import { Dropdown } from './Dropdown';

export const HotTags = () => {
  return (
    <div>
      <div className="w-96 justify-between items-center inline-flex">
        <Typography.Body variant="large-bold">Hot tags</Typography.Body>
        <div className="flex-col justify-start mt-2 items-start inline-flex">
          <Dropdown
            title="Sort"
            subtitle="Sort tags by"
            items={['This week', 'Today']}
            alignment="right"
          />
        </div>
      </div>
      <Card.Primary className="w-96 mt-4">
        <div className="grid gap-3">
          <div className="justify-start items-center gap-3 inline-flex">
            <Post.Counter counter={1} />
            <Post.Tag clicked color="amber">
              #Bitcoin
            </Post.Tag>
            <div className="h-8 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-start inline-flex">
              <Typography.Body variant="small">317 posts</Typography.Body>
            </div>
          </div>
          <div className="justify-start items-center gap-3 inline-flex">
            <Post.Counter counter={2} />
            <Post.Tag clicked color="blue">
              #Keys
            </Post.Tag>
            <div className="h-8 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-start inline-flex">
              <Typography.Body variant="small">197 posts</Typography.Body>
            </div>
          </div>
          <div className="justify-start items-center gap-3 inline-flex">
            <Post.Counter counter={3} />
            <Post.Tag clicked color="fuchsia">
              #Hypekit
            </Post.Tag>
            <div className="h-8 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-start inline-flex">
              <Typography.Body variant="small">169 posts</Typography.Body>
            </div>
          </div>
          <div className="justify-start items-center gap-3 inline-flex">
            <Post.Counter counter={4} />
            <Post.Tag clicked color="cyan">
              #Autonomy
            </Post.Tag>
            <div className="h-8 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-start inline-flex">
              <Typography.Body variant="small">109 posts</Typography.Body>
            </div>
          </div>
          <div className="justify-start items-center gap-3 inline-flex">
            <Post.Counter counter={5} />
            <Post.Tag clicked color="yellow">
              #Satoshi
            </Post.Tag>
            <div className="h-8 px-3 py-1.5 rounded-[32px] border border-white border-opacity-20 flex-col justify-center items-start inline-flex">
              <Typography.Body variant="small">46 posts</Typography.Body>
            </div>
          </div>
        </div>
        <Button.Medium icon={<Icon.Tag size="16" />} className="mt-6">
          Explore All
        </Button.Medium>
      </Card.Primary>
    </div>
  );
};
