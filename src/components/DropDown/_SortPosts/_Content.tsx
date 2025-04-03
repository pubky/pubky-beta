import { TSort } from '@/types';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';

const icons = {
  recent: <Icon.Asterisk size="24" />,
  popularity: <Icon.Fire size="24" />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

interface ContentSortProps {
  sort: TSort;
  setSort: (sort: TSort) => void;
  setDropdownValue: any;
  setOpenDropdown: any;
}

export default function ContentSortPosts({ sort, setSort, setDropdownValue, setOpenDropdown }: ContentSortProps) {
  return (
    <>
      <DropDownUI.Item
        label="Recent"
        value="Recent"
        selected={sort === 'recent'}
        icon={icons.recent}
        onClick={() => {
          setDropdownValue({
            value: 'recent',
            textOption: 'Recent',
            iconOption: icons.recent
          });
          setSort('recent');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Popularity"
        value="Popularity"
        selected={sort === 'popularity'}
        icon={icons.popularity}
        onClick={() => {
          setDropdownValue({
            value: 'popularity',
            textOption: 'Popularity',
            iconOption: icons.popularity
          });
          setSort('popularity');
          setOpenDropdown(false);
        }}
      />
    </>
  );
}
