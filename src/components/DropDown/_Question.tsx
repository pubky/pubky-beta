import { Icon, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface QuestionProps extends React.HTMLAttributes<HTMLDivElement> {
  question: React.ReactNode;
  answer: React.ReactNode;
  open: boolean;
  setOpen: () => void;
}

export default function Question({ question, answer, open, setOpen, ...rest }: QuestionProps) {
  const baseCSS =
    'cursor-pointer relative w-full p-6 rounded-2xl border border-white border-opacity-20 hover:border-opacity-30 flex-col justify-start items-start gap-6 inline-flex';

  return (
    <div onClick={() => setOpen()} className={twMerge(baseCSS, rest.className)}>
      <div className="w-full flex items-center justify-between">
        <Typography.Body variant="small-bold">{question}</Typography.Body>
        <div className={twMerge('transform transition-transform duration-300', open && 'rotate-90')}>
          <Icon.Next size="16" />
        </div>
      </div>
      <div
        className={twMerge(
          'transition-all duration-300 ease-in-out overflow-hidden',
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 -mt-6'
        )}
      >
        {answer}
      </div>
    </div>
  );
}
