import { twMerge } from 'tailwind-merge';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface CloseActionProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const CloseAction = ({ ...rest }: CloseActionProps) => {
  return (
    <Button.Action
      {...rest}
      variant="custom"
      icon={<Icon.X size="24" />}
      className={twMerge('absolute top-[-25px] right-[-25px]', rest.className)}
    />
  );
};
