import { Button } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <div className={'pb-8'}>
        <Button.Create />
      </div>
    </div>
  );
}
