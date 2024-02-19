import { Button, Icon } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <div className={'pb-8'}>
        <Button.Large svg={<Icon.ArrowUp />}>Send</Button.Large>
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
        </Button.Medium>
        <Button.Action variant="article" />
        <Button.Action variant="article" disable />
        <Button.Action variant="link" />
        <Button.Action variant="link" disable />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="mode" label="label" counter={3} size="small" />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="posts" label="label" counter={3} active />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="link" label="label" counter={3} size="large" />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="mode" label="label" size="small" />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="posts" label="label" active />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="link" label="label" size="large" />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="link" size="small" disable />
        <Button.Action variant="link" disable />
        <Button.Action variant="link" size="large" disable />`
        <Button.Action variant="advanced" size="small" />
        <Button.Action variant="all" size="small" label="All" />
        <Button.Action variant="mode" size="medium" label="All" />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="all" size="small" label="Podcasts" />
      </div>
      <div className={'pb-8'}>
        <Button.Action
          variant="custom"
          size="large"
          icon={<Icon.Play />}
          label="Play"
        />
      </div>
      <div className={'pb-8'}>
        <Button.Action variant="plus" size="small" href="https://google.com" />
        <Button.Action variant="minus" size="small" />
      </div>
    </div>
  );
}
