import { Card, Input, Button, Icon } from '@social/ui-shared';

export default function RecoveryPhrase() {
  return (
    <Card.Primary
      title="Recovery Phrase"
      text="Enter your recovery phrase from any (paper) backup (less secure)."
    >
      <div className="my-6 grid grid-rows-6 grid-flow-col gap-1">
        <Input.Word placeholder="1." disabled />
        <Input.Word placeholder="2." disabled />
        <Input.Word placeholder="3." disabled />
        <Input.Word placeholder="4." disabled />
        <Input.Word placeholder="5." disabled />
        <Input.Word placeholder="6." disabled />
        <Input.Word placeholder="7." disabled />
        <Input.Word placeholder="8." disabled />
        <Input.Word placeholder="9." disabled />
        <Input.Word placeholder="10." disabled />
        <Input.Word placeholder="11." disabled />
        <Input.Word placeholder="12." disabled />
      </div>
      <Button.Large
        disabled
        className="mt-4 lg:mt-0"
        icon={<Icon.Key size="16" color="gray" />}
      >
        Sign in
      </Button.Large>
    </Card.Primary>
  );
}
