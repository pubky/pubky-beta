import { CheckboxIcon } from './Input.CheckboxIcon';

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({
  checked,
  disabled = false,
  ...rest
}: CheckboxProps) => {
  let cssStyles = `inline-block w-8 h-8 rounded-lg border`;

  if (disabled) {
    cssStyles += ' bg-white bg-opacity-10 border-white border-opacity-10';
  } else if (checked) {
    cssStyles += ' bg-fuchsia-500 bg-opacity-30 border-fuchsia-500';
  } else {
    cssStyles += ' bg-white bg-opacity-10 border-white border-opacity-30';
  }

  return (
    <label className={`${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
      <span className={cssStyles}>{checked && <CheckboxIcon />}</span>
      <input
        {...rest}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="hidden"
      />
    </label>
  );
};
