import { Content, Icon, Typography } from '@social/ui-shared';

export default function ContactsList() {
  return (
    <div>
      <Content.Divider />
      <div className="mb-4 flex-row">
        <div className={`flex w-full justify-center mt-10`}>
          <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
        </div>
        <Typography.Body
          variant="medium-bold"
          className="col-span-3 mt-4 flex justify-center items-center gap-6 text-opacity-20"
        >
          Loading Contacts
        </Typography.Body>
      </div>
    </div>
  );
}
