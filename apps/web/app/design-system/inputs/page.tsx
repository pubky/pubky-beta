import { Form } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8 w-full'}>
        <form>
          <Form.InputField placeHolder="hint" />
          <Form.InputField placeHolder="hint" multiline height={'h-[170px]'} />
        </form>
      </div>
    </div>
  );
}
