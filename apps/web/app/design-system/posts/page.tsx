import { Post } from '@social/ui-shared';

export default function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <Post.Counter counter={3} />
    </div>
  );
}
