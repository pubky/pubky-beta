import { Typography } from '../Typography';
import { twMerge } from 'tailwind-merge';

interface TagProps extends React.HTMLAttributes<HTMLButtonElement> {
  clicked: boolean;
  color?: string;
  children: string;
}

export const Tag = ({
  clicked = false,
  color,
  children,
  ...rest
}: TagProps) => {
  let cssClasses = clicked
    ? 'bg-white bg-opacity-20 border-transparent border-white'
    : 'bg-white bg-opacity-20 border-transparent hover:bg-opacity-30';

  switch (color) {
    case 'yellow':
      cssClasses = clicked
        ? 'bg-yellow-400 bg-opacity-30 border-transparent border-yellow-400'
        : 'bg-yellow-400 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
    case 'amber':
      cssClasses = clicked
        ? 'bg-amber-500 bg-opacity-30 border-amber-500'
        : 'bg-amber-500 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
    case 'red':
      cssClasses = clicked
        ? 'bg-red-600 bg-opacity-30 border-red-600'
        : 'bg-red-600 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
    case 'fuchsia':
      cssClasses = clicked
        ? 'bg-fuchsia-500 bg-opacity-30 border-fuchsia-500'
        : 'bg-fuchsia-500 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
    case 'blue':
      cssClasses = clicked
        ? 'bg-blue-600 bg-opacity-30 border-blue-600'
        : 'bg-blue-600 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
    case 'cyan':
      cssClasses = clicked
        ? 'bg-cyan-400 bg-opacity-30 border-cyan-400'
        : 'bg-cyan-400 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
    case 'green':
      cssClasses = clicked
        ? 'bg-green-500 bg-opacity-30 border-green-500'
        : 'bg-green-500 bg-opacity-30 border-transparent hover:bg-opacity-60';
      break;
  }

  return (
    <button
      {...rest}
      className={twMerge(
        `border h-8 px-3 py-1 rounded-lg cursor-pointer`,
        cssClasses,
        rest.className
      )}
    >
      <Typography.Body variant="small-bold">{children}</Typography.Body>
    </button>
  );
};
