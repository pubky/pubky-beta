import { Button, Icon, Typography } from '@social/ui-shared';

interface ContentPrivacyPolicyProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentPrivacyPolicy({ setShowModal }: ContentPrivacyPolicyProps) {
  return (
    <>
      <Typography.Body
        className="text-opacity-80 my-4 pr-8 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-webkit"
        variant="medium-light"
      >
        Effective Date: 15 May 2025
        <br />
        <br />
        SCOPE
        <br />
        This Privacy Policy (“Policy”) describes how Synonym Software Ltd. treats personal information on the Pubky
        platform and the products, services and features made available as part of the platform (collectively, the
        “Platform”).
        <br />
        <br />
        POLICY SUMMARY NOTICE AT COLLECTION
        <br />
        We collect, and in the past 12 months have collected, the following categories of information from and about
        you: identifiers; commercial information; internet or similar network activity; visual information; and
        inferences drawn from other personal information. We collect these categories of information from you in order
        to provide our services to you, to run our business, to communicate with you, and as required by law. We may
        have disclosed each of these categories of personal information for a business purpose as described below. We
        have not “sold” or “shared” personal information in the past 12 months.
      </Typography.Body>
      <Button.Large icon={<Icon.Check size="16" />} onClick={() => setShowModal(false)}>
        I have read and agree with the Privacy Policy
      </Button.Large>
    </>
  );
}
