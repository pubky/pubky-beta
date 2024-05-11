import { twMerge } from 'tailwind-merge';

interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export default function DisplayText({ ...rest }: DisplayTextProps) {
  return (
    <div
      {...rest}
      className={twMerge(
        'h-20 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[400px]',
        rest.className
      )}
    />
  );
}
