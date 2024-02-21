'use client';

import { Icon, Input } from '@social/ui-shared';
import { useState } from 'react';

export default function Index() {
  const [checkedA, setCheckedA] = useState(false);
  const [checkedB, setCheckedB] = useState(false);

  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8 w-full'}>
        <form>
          <div className="pb-4">
            <Input.Text placeholder="hint" action={<Icon.Plus />}></Input.Text>
          </div>
          <div className="pb-4">
            <Input.TextArea className={'h-[170px]'}>test</Input.TextArea>
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
            <Input.Cursor />
          </div>
        </form>
        <div>
          <Input.Dropdown items={['Week', 'Day']} />
          <Input.Dropdown
            items={[
              {
                icon: <Icon.ArrowUp />,
                option: 'Week',
              },
              {
                icon: <Icon.Asterisk />,
                option: 'Month',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
