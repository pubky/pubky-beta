import { Icon, DropDown as DropDownUI } from '@social/ui-shared';

interface ContentLanguagesProps {
  dropdownValue: any;
  setDropdownValue: any;
  setOpenDropdown: any;
}

export default function ContentLanguages({ dropdownValue, setDropdownValue, setOpenDropdown }: ContentLanguagesProps) {
  return (
    <>
      <DropDownUI.Item
        label="English"
        value="english"
        selected={dropdownValue.value === 'english'}
        icon={<Icon.UnitedStates size="24" />}
        onClick={() => {
          setDropdownValue({
            value: 'english',
            textOption: 'English',
            iconOption: <Icon.UnitedStates size="24" />
          });
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Spanish"
        value="spanish"
        selected={dropdownValue.value === 'spanish'}
        icon={<Icon.Spain size="24" />}
        disabled
        //onClick={() => {
        //  setDropdownValue({
        //   value: 'spanish',
        //   textOption: 'spanish',
        //   iconOption: <Icon.Spain size="24" />,
        // });
        // setOpenDropdown(false);
        //}}
      />
      <DropDownUI.Item
        label="German"
        value="german"
        selected={dropdownValue.value === 'german'}
        icon={<Icon.Germany size="24" />}
        disabled
        //onClick={() => {
        // setDropdownValue({
        //    value: 'german',
        //   textOption: 'german',
        //   iconOption: <Icon.Germany size="24" />,
        // });
        //  setOpenDropdown(false);
        //}}
      />
      <DropDownUI.Item
        label="French"
        value="french"
        selected={dropdownValue.value === 'french'}
        icon={<Icon.France size="24" />}
        disabled
        //onClick={() => {
        //  setDropdownValue({
        //    value: 'french',
        //    textOption: 'french',
        //    iconOption: <Icon.France size="24" />,
        // });
        // setOpenDropdown(false);
        //}}
      />
      <DropDownUI.Item
        label="Italian"
        value="italian"
        selected={dropdownValue.value === 'italian'}
        icon={<Icon.Italy size="24" />}
        disabled
        //onClick={() => {
        //  setDropdownValue({
        //    value: 'italian',
        //    textOption: 'italian',
        //    iconOption: <Icon.Italy size="24" />,
        //  });
        // setOpenDropdown(false);
        //}}
      />
    </>
  );
}
