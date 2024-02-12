import { Typography } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <Typography.Display>Display Typography</Typography.Display>
      <Typography.PageTitle>Page Title Typography</Typography.PageTitle>
      <Typography.H1>H1 Typography</Typography.H1>
      <Typography.H2>H2 Typography</Typography.H2>
      <Typography.H2 variant="light">H2 light Typography</Typography.H2>
      <Typography.Body>Body Large Typography</Typography.Body>
      <Typography.Body variant="large-bold">
        Body Bold Typography
      </Typography.Body>
      <Typography.Body variant="medium">Body Medium Typography</Typography.Body>
      <Typography.Body variant="medium-bold">
        Body Medium Bold Typography
      </Typography.Body>
      <Typography.Body variant="small">Body Small Typography</Typography.Body>
      <Typography.Body variant="small-bold">
        Body Small Bold Typography
      </Typography.Body>
    </div>
  );
}
