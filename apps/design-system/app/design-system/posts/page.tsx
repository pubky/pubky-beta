import { PostUtil } from '@social/ui-shared';

export default function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className="pb-8">
        <PostUtil.Counter counter={3} />
      </div>
      <div className="pb-8">
        <PostUtil.Stat label="Followers">423</PostUtil.Stat>
      </div>
    </div>
  );
}
