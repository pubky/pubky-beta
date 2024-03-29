import { Content } from '@social/ui-shared';

export default function FollowerMe() {
  return (
    <Content.Grid className="py-8 sm:py-12 flex justify-between">
      <div className="gap-6 inline-flex">
        <div className="gap-3 flex items-center">
          <svg
            className="w-16 h-10 me-3 text-gray-200 dark:text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32" />
        </div>
      </div>
      <div className="gap-3 flex">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-3" />
      </div>
    </Content.Grid>
  );
}
