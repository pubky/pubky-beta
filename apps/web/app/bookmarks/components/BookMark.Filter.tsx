import { Icon, Button, Filter as FilterUI, DropDown } from '@social/ui-shared';

export default function Filter() {
  return (
    <FilterUI.Root>
      <FilterUI.Row>
        <FilterUI.SmallRow className="hidden sm:flex">
          <Button.Action variant="all" active />
          <Button.Action variant="posts" />
          <Button.Action variant="image" />
          <Button.Action variant="video" />
          <Button.Action variant="link" />
        </FilterUI.SmallRow>
        <DropDown.Root
          label="Sort by"
          title="Sort"
          subtitle="Sort posts by"
          items={['Recent', 'Weight', 'Hotness', 'Discovery']}
        />
      </FilterUI.Row>
      <FilterUI.Row>
        <DropDown.Root
          title="Mode"
          subtitle="Switch to a different view "
          items={[
            {
              icon: <Icon.SquareHalf />,
              label: 'Sidebar',
            },
            {
              icon: <Icon.List />,
              label: 'List',
            },
            {
              icon: <Icon.DotsNine />,
              label: 'Grid',
            },
            {
              icon: <Icon.SquaresFour />,
              label: 'Columns',
            },
          ]}
          alignment="right"
        />
      </FilterUI.Row>
    </FilterUI.Root>
  );
}
