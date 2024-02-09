import { Form } from '@social/ui-shared';
import { Dropdown } from 'libs/ui-shared/src/lib/Form/Form.Dropdown';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <Form.InputField placeHolder="ciao" label="label" />
      <br />
      <Form.Cursor placeHolder="cursor" />
      <br />
      <Form.Search width="990px" placeHolder="Search" />
      <br />
      <Form.Search
        width="990px"
        tags={['#Bitcoin', '#Mining']}
        placeHolder="Search"
      />
      <br />
      <Form.Switch />
      <br />
      <Form.Switch disable={true} />
      <br />
      <Form.CheckBox />
      <br />
      <Form.CheckBox />
      <br />
      <Form.Radio
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
      />
      <br />
      <Dropdown
        items={['day', 'month', 'year']}
        label="Sort by"
        text="Posting this"
      />
    </div>
  );
}
