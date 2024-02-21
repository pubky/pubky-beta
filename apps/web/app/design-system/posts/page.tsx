import { Post } from '@social/ui-shared';

export default function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className="pb-8">
        <Post.Counter counter={3} />
      </div>
      <div className="pb-8">
        <Post.Stat label="Followers">423</Post.Stat>
      </div>
    </div>
  );
}
