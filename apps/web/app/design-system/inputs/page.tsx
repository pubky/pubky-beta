import { Form } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8 w-full'}>
        <form>
          <div className="pb-4">
            <Form.InputField placeHolder="hint" />
          </div>
          <div className="pb-4">
            <Form.InputField
              placeHolder="hint"
              multiline
              height={'h-[170px]'}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
