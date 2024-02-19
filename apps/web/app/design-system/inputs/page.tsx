import { Input } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8 w-full'}>
        <form>
          <div className="pb-4">
            <Input.Text placeHolder="hint" />
          </div>
          <div className="pb-4">
            <Input.Text placeHolder="hint" multiline height={'h-[170px]'} />
          </div>
          <div className="pb-4">
            <Input.Checkbox disabled />
          </div>
          <div className="pb-4">
            <Input.Checkbox />
          </div>
          <div className="pb-4">
            <Input.Cursor />
          </div>
          <div className="pb-4">
            <Input.Dropdown items={['one', 'two', 'three']} />
          </div>
        </form>
      </div>
    </div>
  );
}
