import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  list: string[];
  title?: string;
  className?: string;
}

export const Primary = ({ title, list, ...rest }: ListProps) => {
  const baseCSS = 'flex-col justify-start items-start gap-6 inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {title && <Typography.Body variant="medium-bold">{title}</Typography.Body>}
      {list && (
        <>
          {list.map((item, index) => (
            <li key={index} className="flex items-center">
              <Typography.Body variant="medium" className="text-opacity-80 ml-2.5 leading-[.1rem]">
                <span className="mr-2 text-[20px]">&#8226;</span>
                {item}
              </Typography.Body>
            </li>
          ))}
        </>
      )}
    </div>
  );
};
