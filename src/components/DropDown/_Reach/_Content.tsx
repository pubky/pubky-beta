import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';

const icons = {
  following: <Icon.UsersRight />,
  followers: <Icon.UsersLeft />,
  friends: <Icon.Smiley />,
  all: <Icon.Broadcast />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

interface ContentReachProps {
  setDropdownValue: any;
  setOpenDropdown: any;
}

export default function ContentReach({ setDropdownValue, setOpenDropdown }: ContentReachProps) {
  const { reach, setReach } = useFilterContext();

  return (
    <>
      <DropDownUI.Item
        label="All"
        value="All"
        selected={reach === 'all'}
        icon={<Icon.Broadcast />}
        onClick={() => {
          setDropdownValue({
            value: 'all',
            textOption: 'All',
            iconOption: icons.all
          });
          setReach('all');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Following"
        value="Following"
        selected={reach === 'following'}
        icon={<Icon.UsersRight />}
        onClick={() => {
          setDropdownValue({
            value: 'following',
            textOption: 'Following',
            iconOption: icons.following
          });
          setReach('following');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Friends"
        value="Friends"
        selected={reach === 'friends'}
        icon={<Icon.Smiley />}
        onClick={() => {
          setDropdownValue({
            value: 'friends',
            textOption: 'Friends',
            iconOption: icons.friends
          });
          setReach('friends');
          setOpenDropdown(false);
        }}
      />
    </>
  );
}
