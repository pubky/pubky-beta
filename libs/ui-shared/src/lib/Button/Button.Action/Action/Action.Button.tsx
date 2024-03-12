import { twMerge } from 'tailwind-merge';

interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...rest }: ActionButtonProps) => {
  const baseCSS = `rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex`;

  return (
    <button {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </button>
  );
};
