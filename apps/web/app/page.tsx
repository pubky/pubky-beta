import {Button} from "@social/ui-shared";
import { ArrowUp } from "libs/ui-shared/src/lib/Icon/Icon.Arrow";
import { Plus, Tag } from "libs/ui-shared/src/lib/Icon/Icon.Design";

export default async function Index() {
  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <div className="w-[200px]">
     <Button.Create />
     <Button.Large svg={<ArrowUp/>} title="Send"/>
     <Button.Large state="disable" svg={<ArrowUp color="gray"/>} title="Send"/>
     <br/>
     <Button.Large type="secondary" svg={<ArrowUp/>} title="Secondary"/>
     <br/>
     <Button.Medium title="Tag" svg={<Tag />}/>
     <br/>
     <Button.Medium title="Tag" state="border" svg={<Tag />}/>
     <br/>
     <Button.Medium title="Tag" state="no-border" svg={<Tag />}/>
     <br />
     <Button.Tile title="Add Tile" svg={<Plus />}/>
     </div>
    </div>
  );
}
