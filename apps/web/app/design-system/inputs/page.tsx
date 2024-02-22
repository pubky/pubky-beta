'use client';

import { Icon, Input } from '@social/ui-shared';
import { useState } from 'react';

type Tag = {
  value: string;
  color: string;
};

export default function Index() {
  const [checkedA, setCheckedA] = useState(false);
  const [checkedB, setCheckedB] = useState(false);
  const [checkedC, setCheckedC] = useState(false);
  const [checkedD, setCheckedD] = useState(false);
  const [selectedA, setSelectedA] = useState(false);
  const [selectedB, setSelectedB] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const tags: Tag[] = [
    {
      value: 'tag1',
      color: 'bg-yellow-400',
    },
    {
      value: 'tag2',
      color: 'bg-red-600',
    },
    {
      value: 'tag3',
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="flex-1 w-full h-full bg-black p-10">
      <div className={'pb-8 w-full'}>
        <form>
          <div className="pb-4">
            <Input.Search>
              {tags && (
                <Input.SearchTags>
                  {tags.map((tag, index) => (
                    <Input.SearchTag
                      color={tag.color}
                      key={index}
                      actions={[<Icon.X key={index} />]}
                      value={tag.value}
                    />
                  ))}
                </Input.SearchTags>
              )}
              <Input.SearchInput />
              <Input.SearchActions>
                {tags && <Icon.GridFour />}
                <Icon.MagnifyingGlass />
              </Input.SearchActions>
            </Input.Search>
          </div>

          <div className="pb-4">
            <Input.Label value="Label" />
            <Input.Text
              placeholder="hint"
              action={<Icon.Plus />}
              defaultValue={'teste'}
            />
          </div>
          <div className="pb-4">
            <Input.Label value="Label" />
            <Input.TextArea className={'h-[170px]'} defaultValue={'teste'} />
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
          <div className="pb-4">
            <Input.Cursor />
          </div>
          <div className="pb-4">
            <Input.Radio
              disabled
              value={radioValue}
              onChange={(value) => setRadioValue(value)}
              options={[
                {
                  value: '1',
                },
                {
                  value: '2',
                },
              ]}
            />
          </div>
          <div className="pb-8">
            <Input.Switch
              checked={checkedC}
              onChange={(value) => setCheckedC(value)}
              disabled
            />
            <Input.Switch
              checked={checkedD}
              onChange={(value) => setCheckedD(value)}
            />
          </div>
          <div className="pb-8">
            <Input.Dropdown
              onClick={(e) => e.preventDefault()}
              items={['Week', 'Day']}
            />
            <Input.Dropdown
              onClick={(e) => e.preventDefault()}
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
        </form>
        <div className="pb-4">
          <Input.Select
            text="Traditional"
            size="small"
            active={selectedA}
            onClick={(active: boolean) => {
              setSelectedA(active);
            }}
          />
          <Input.Select
            text="Traditional"
            size="large"
            disabled
            active={selectedB}
            onClick={(active: boolean) => {
              setSelectedB(active);
            }}
          />
        </div>
      </div>
    </div>
  );
}
