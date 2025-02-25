import { Content } from '@social/ui-shared';

export default function ProfileCard() {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="inline-grid gap-2 mr-auto">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32" />
        </div>
        <svg
          className="w-16 h-10 me-3 text-gray-200 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
      </div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-6" />
      <Content.Divider />
      <div className="my-12">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[300px] mt-2"></div>
      </div>
      <div className="my-12">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[300px] mt-2"></div>
      </div>
      <div className="my-12">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[300px] mt-2"></div>
      </div>
      <div className="my-12">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32 mt-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-[300px] mt-2"></div>
      </div>
    </div>
  );
}
