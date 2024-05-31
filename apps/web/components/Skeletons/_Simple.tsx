import { Icon } from '@social/ui-shared';

export default function Simple() {
  return (
    <div className="mb-4 flex-row">
      <div className={`flex w-full justify-center mt-2`}>
        <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
      </div>
    </div>
  );
}
