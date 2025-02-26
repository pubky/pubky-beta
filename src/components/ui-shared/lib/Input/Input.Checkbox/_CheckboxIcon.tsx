import { Check } from '../../Icon/_System';

interface CheckboxIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

export const CheckboxIcon = ({ icon = <Check size="16" />, ...rest }: CheckboxIconProps) => {
  return (
    <div {...rest} className="absolute justify-self-center self-center">
      {icon}
    </div>
  );
};
