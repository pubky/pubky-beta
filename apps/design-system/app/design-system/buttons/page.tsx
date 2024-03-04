import { Button, Icon } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <div className={'pb-8'}>
        <Button.Large icon={<Icon.ArrowUp />}>Send</Button.Large>
        <Button.Large icon={<Icon.Plus />}>Primary Button</Button.Large>
        <Button.Large icon={<Icon.Plus />} disabled>
          Primary Button
        </Button.Large>
        <Button.Large icon={<Icon.Plus />} variant="secondary">
          Secondary Button
        </Button.Large>
        <Button.Large icon={<Icon.Plus />} variant="secondary" disabled>
          Secondary Button Disabled
        </Button.Large>

        <Button.Medium icon={<Icon.Tag />}>Tag</Button.Medium>
        <Button.Medium icon={<Icon.Tag color="gray" />} disabled>
          Tag
        </Button.Medium>

        <Button.Medium variant="line">Tag</Button.Medium>
        <Button.Medium variant="line" disabled>
          Tag
        </Button.Medium>

        <Button.Medium variant="subtle">Tag</Button.Medium>
        <Button.Medium variant="subtle" disabled>
          Tag
        </Button.Medium>
        <Button.Action variant="article" />
        <Button.Action variant="article" disabled />
        <Button.Action variant="link" />
        <Button.Action variant="link" disabled />
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
        <Button.Action variant="link" size="small" disabled />
        <Button.Action variant="link" disabled />
        <Button.Action variant="link" size="large" disabled />`
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
        <Button.Action variant="plus" size="small" />
        <Button.Action variant="minus" size="small" />
      </div>
      <div className={'pb-8'}>
        <Button.Tile icon={<Icon.Plus />}>Tile Button</Button.Tile>
        <Button.Tile icon={<Icon.Plus color="gray" />} disabled>
          Tile Button
        </Button.Tile>
      </div>
    </div>
  );
}
