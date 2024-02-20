'use client';

import { Input } from '@social/ui-shared';
import { useState } from 'react';

export default function Index() {
  const [checkedA, setCheckedA] = useState(false);
  const [checkedB, setCheckedB] = useState(false);

  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8 w-full'}>
        <form>
          <div className="pb-4">
            <Input.Text placeHolder="hint" />
          </div>
          <div className="pb-4">
            <Input.Text placeHolder="hint" multiline height={'h-[170px]'} />
          </div>
          <div className="pb-4">
            <Input.Checkbox
              disabled={true}
              checked={false}
              onChange={() => {}}
            />
            <Input.Checkbox
              disabled={false}
              checked={checkedA}
              onChange={() => setCheckedA(!checkedA)}
            />
            <Input.Checkbox
              disabled={false}
              checked={checkedB}
              onChange={() => setCheckedB(!checkedB)}
            />
          </div>
          <div className="pb-4">
            <Input.Cursor
              className="text-black"
              onClick={() => console.log('hey')}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
