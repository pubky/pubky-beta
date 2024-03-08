import { Button, Filter as FilterUI } from '@social/ui-shared';
import DropDownSort from './BookMark.DropDownSort';
import DropDownMode from './BookMark.DropDownMode';

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
        <DropDownSort />
      </FilterUI.Row>
      <FilterUI.Row>
        <DropDownMode />
      </FilterUI.Row>
    </FilterUI.Root>
  );
}
