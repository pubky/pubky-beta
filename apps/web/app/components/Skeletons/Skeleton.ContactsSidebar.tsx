import { SideCard } from '@social/ui-shared';

export default function ContactsSidebar() {
  return (
    <div>
      <SideCard.Header title="profile" variantTitle="label" />
      <SideCard.Content className="flex-row gap-3 inline-flex">
        <div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-36 mt-4"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-32"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-36 mt-4"></div>
        </div>
      </SideCard.Content>
    </div>
  );
}
