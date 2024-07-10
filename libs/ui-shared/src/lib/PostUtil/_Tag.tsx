import { Typography } from '../Typography';
import { twMerge } from 'tailwind-merge';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  clicked: boolean;
  color?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Tag = ({
  clicked = false,
  color,
  children,
  action,
  ...rest
}: TagProps) => {
  let cssClasses = clicked
    ? 'bg-white bg-opacity-20 border-transparent border-white'
    : 'bg-white bg-opacity-20 border-transparent hover:bg-opacity-30';
  let cssText = 'text-white';

  switch (color) {
    case 'yellow':
      cssClasses = clicked
        ? 'bg-yellow-400 bg-opacity-30 border-transparent border-yellow-400'
        : 'bg-yellow-400 bg-opacity-30 border-transparent hover:bg-opacity-60';
      cssText = 'text-yellow-200';
      break;
    case 'amber':
      cssClasses = clicked
        ? 'bg-amber-500 bg-opacity-30 border-amber-500'
        : 'bg-amber-500 bg-opacity-30 border-transparent hover:bg-opacity-60';
      cssText = 'text-amber-300';
      break;
    case 'red':
      cssClasses = clicked
        ? 'bg-red-600 bg-opacity-30 border-red-600'
        : 'bg-red-600 bg-opacity-30 border-transparent hover:bg-opacity-60';
      cssText = 'text-red-400';
      break;
    case 'fuchsia':
      cssClasses = clicked
        ? 'bg-fuchsia-500 bg-opacity-20 border-fuchsia-500 border-opacity-60'
        : 'bg-fuchsia-500 bg-opacity-10 border-transparent hover:bg-opacity-60';
      cssText = 'text-fuchsia-200';
      break;
    case 'blue':
      cssClasses = clicked
        ? 'bg-blue-600 bg-opacity-30 border-blue-600'
        : 'bg-blue-600 bg-opacity-30 border-transparent hover:bg-opacity-60';
      cssText = 'text-blue-400';
      break;
    case 'cyan':
      cssClasses = clicked
        ? 'bg-cyan-400 bg-opacity-30 border-cyan-400'
        : 'bg-cyan-400 bg-opacity-30 border-transparent hover:bg-opacity-60';
      cssText = 'text-cyan-200';
      break;
    case 'green':
      cssClasses = clicked
        ? 'bg-green-500 bg-opacity-30 border-green-500'
        : 'bg-green-500 bg-opacity-30 border-transparent hover:bg-opacity-60';
      cssText = 'text-green-300';
      break;
    case 'purple':
      cssClasses = clicked
        ? 'bg-purple-500 bg-opacity-20 border-purple-500'
        : 'bg-purple-500 bg-opacity-20 border-transparent hover:bg-opacity-30';
      cssText = 'text-purple-300';
      break;
  }

  return (
    <div
      {...rest}
      className={twMerge(
        `inline-flex border h-8 px-3 py-1 rounded-lg cursor-pointer text-center`,
        cssClasses,
        rest.className
      )}
    >
      <div className="flex gap-2">
        <Typography.Body className={cssText} variant="small-bold">
          {children}
        </Typography.Body>
        {action}
      </div>
    </div>
  );
};
