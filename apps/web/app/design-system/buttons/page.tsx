import { Button } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      {/* <Button.Large svg={<Icon.ArrowUp />}>Send</Button.Large>
      <Button.Large svg={<Icon.Plus />}>Primary Button</Button.Large>
      <Button.Large svg={<Icon.Plus />} disable>
        Primary Button
      </Button.Large>
      <Button.Large svg={<Icon.Plus />} variant="secondary">
        Secondary Button
      </Button.Large>
      <Button.Large svg={<Icon.Plus />} variant="secondary" disable>
        Secondary Button Disabled
      </Button.Large>

      <Button.Medium>Tag</Button.Medium>
      <Button.Medium disable>Tag</Button.Medium>

      <Button.Medium variant="line">Tag</Button.Medium>
      <Button.Medium variant="line" disable>
        Tag
      </Button.Medium>

      <Button.Medium variant="subtle">Tag</Button.Medium>
      <Button.Medium variant="subtle" disable>
        Tag
      </Button.Medium> */}
      {/* <Button.Action variant="article" />
      <Button.Action variant="article" disable />
      <Button.Action variant="link" />
      <Button.Action variant="link" disable /> */}
      <div className={'pb-4'}>
        <Button.Action variant="link" size="small" />
        <Button.Action variant="link" />
        <Button.Action variant="link" size="large" />
      </div>
      <div>
        <Button.Action variant="link" size="small" disable />
        <Button.Action variant="link" disable />
        <Button.Action variant="link" size="large" disable />
      </div>
    </div>
  );
}
