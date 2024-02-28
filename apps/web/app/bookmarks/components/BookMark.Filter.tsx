import { Icon, Button, Filter as FilterUI, DropDown } from '@social/ui-shared';

export default function Filter() {
  return (
    <FilterUI.Root>
      <div className="gap-6 inline-flex">
        <FilterUI.Types>
          <Button.Action variant="all" active />
          <Button.Action variant="posts" />
          <Button.Action variant="image" />
          <Button.Action variant="video" />
          <Button.Action variant="link" />
        </FilterUI.Types>
        <DropDown.Root
          label="Sort by"
          title="Sort"
          subtitle="Sort posts by"
          items={['Recent', 'Weight', 'Hotness', 'Discovery']}
        />
      </div>
      <FilterUI.Select>
        <DropDown.Root
          title="Mode"
          subtitle="Switch to a different view "
          items={[
            {
              icon: <Icon.SquareHalf />,
              option: 'Sidebar',
            },
            {
              icon: <Icon.List />,
              option: 'List',
            },
            {
              icon: <Icon.DotsNine />,
              option: 'Grid',
            },
            {
              icon: <Icon.SquaresFour />,
              option: 'Columns',
            },
          ]}
          alignment="right"
        />
      </FilterUI.Select>
    </FilterUI.Root>
  );
}
