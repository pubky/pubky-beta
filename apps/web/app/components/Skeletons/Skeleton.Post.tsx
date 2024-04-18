'use client';

import { Post as PostUI } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'full' | 'normal';
}

export default function Post({ size = 'normal', ...rest }: PostProps) {
  const baseCSS =
    size === 'full'
      ? 'grow justify-end gap-1 flex mt-2 lg:mt-4'
      : 'grow justify-end gap-1 flex mt-2';
  return (
    <div className="gap-6 flex flex-col mb-0">
      <PostUI.Root>
        <div>
          <PostUI.MainCard className={twMerge(rest.className)}>
            <PostUI.Header size={size}>
              <div className="justify-start items-center gap-4 flex">
                <svg
                  className="w-10 h-10 me-3 text-gray-300 dark:text-gray-700 text-opacity-50 dark:text-opacity-50 rounded-full"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32"></div>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-24"></div>
              </div>
              <div className={twMerge(baseCSS, rest.className)}>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-12"></div>
              </div>
            </PostUI.Header>
            <div className={'block'}>
              <PostUI.Content
                text={
                  <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full  w-32"></div>
                }
                className={size === 'full' ? 'lg:text-xl' : 'w-full'}
              />
              <PostUI.Footer className={size === 'full' ? 'mt-6' : 'mt-6'}>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[420px]"></div>
              </PostUI.Footer>
              <PostUI.Footer className={size === 'full' ? 'mt-6' : 'mt-6'}>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[400px]"></div>
              </PostUI.Footer>
              <PostUI.Footer className={size === 'full' ? 'mt-6' : 'mt-6'}>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[320px]"></div>
              </PostUI.Footer>
              <PostUI.Footer className={size === 'full' ? 'mt-6' : 'mt-6'}>
                <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[520px]"></div>
              </PostUI.Footer>
            </div>
          </PostUI.MainCard>
        </div>
      </PostUI.Root>
    </div>
  );
}
