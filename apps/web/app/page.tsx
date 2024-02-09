import { Form } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <Form.InputField placeHolder="ciao" label="label" />
      <br/>
      <Form.Cursor placeHolder='cursor'/>
      <br/>
      <Form.Search width='990px' placeHolder='Search' />
      <br/>
      <Form.Search width='990px' tags={["#Bitcoin", "#Mining"]} placeHolder='Search' />
      <br/>
      <Form.Switch />
      <br />
      <Form.Switch disable={true}/>
    </div>
  );
}
