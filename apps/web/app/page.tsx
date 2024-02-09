import { Button } from '@social/ui-shared';
import { ArrowUp } from 'libs/ui-shared/src/lib/Icon/Icon.Arrow';
import { Tag } from 'libs/ui-shared/src/lib/Icon/Icon.Commerce';
import { Plus } from 'libs/ui-shared/src/lib/Icon/Icon.Math';
import { Pause } from 'libs/ui-shared/src/lib/Icon/Icon.Media';
import { Clipboard } from 'libs/ui-shared/src/lib/Icon/Icon.Office';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <div className="w-[200px]">
        <Button.Create />
        <Button.Large svg={<ArrowUp />} title="Send" />
        <Button.Large
          state="disable"
          svg={<ArrowUp color="gray" />}
          title="Send"
        />
        <br />
        <Button.Large type="secondary" svg={<ArrowUp />} title="Secondary" />
        <br />
        <Button.Medium title="Tag" svg={<Tag />} />
        <br />
        <Button.Medium title="Tag" state="border" svg={<Tag />} />
        <br />
        <Button.Medium title="Tag" state="no-border" svg={<Tag />} />
        <br />
        <Button.Tile title="Add Tile" svg={<Plus />} />
        <br />
        <Button.Action svg={<Clipboard />} />
        <br />
        <Button.Action svg={<Clipboard />} label="Label" />
        <br />
        <br />
        <Button.Action svg={<Clipboard />} type="selected" />
        <br />
        <Button.Action svg={<Clipboard />} type="selected" label="Label" />
        <br />
        <br />
        <Button.Action svg={<Clipboard size="16" />} type="small" />
        <br />
        <Button.Action svg={<Clipboard size="16" />} type="post" number={3} />
        <br />
        <Button.Action svg={<Clipboard />} />
        <br />
        <Button.Action
          svg={<Clipboard />}
          type="selected"
          backgroundColorSelected="#FF000052"
          borderColorSelected='#FF0000'
          label="Label"
        />
        <br />
        <br />
        <Button.Action
          svg={<Pause size="20" />}
          sizeSmallButton="64px"
          type="small"
        />
        <br />
      </div>
    </div>
  );
}
