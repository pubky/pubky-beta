import React from 'react';
import { PostUtil } from '../../PostUtil';
import { Utils } from '@social/utils-shared';
import { twMerge } from 'tailwind-merge';

interface SearchTagProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  action?: React.ReactNode;
}

export const SearchTag = ({ value, action, ...rest }: SearchTagProps) => {
  return (
    <PostUtil.Tag
      {...rest}
      action={action}
      className={twMerge(rest.className)}
      color={value && Utils.generateRandomColor(value)}
      clicked={false}
    >
      {Utils.truncateTag(value, 20)}
    </PostUtil.Tag>
  );
};
