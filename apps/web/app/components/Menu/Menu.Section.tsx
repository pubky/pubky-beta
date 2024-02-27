import { PostUtil, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  text: string;
  counter?: number;
}

export const Section = ({ icon, text, counter, ...rest }: SectionProps) => {
  const baseCSS =
    'py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex cursor-pointer hover:bg-white hover:bg-opacity-10';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="items-center gap-2 flex">
        {icon}
        <Typography.Body variant="medium-bold">{text}</Typography.Body>
      </div>
      {counter && (
        <div>
          <PostUtil.Counter
            className="border-fuchsia-500 border-opacity-100"
            counter={counter}
          />
        </div>
      )}
    </div>
  );
};
