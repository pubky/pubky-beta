import { Button, Icon, Typography } from '@social/ui-shared';

interface ContentTermsOfServiceProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentTermsOfService({ setShowModal }: ContentTermsOfServiceProps) {
  return (
    <>
      <Typography.Body
        className="text-opacity-80 my-4 pr-8 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-webkit"
        variant="medium-light"
      >
        TERMS AND CONDITIONS
        <br /> Effective Date: 15 May 2025
        <br />
        <br />
        Thank you for using the Pubky platform and the products, services and features we make available to you as part
        of the platform, including the Pubky App (collectively, the “Platform”). The terms and conditions set forth
        below (as updated and amended from time to time, and collectively with the Privacy Policy and any other
        materials explicitly incorporated by us, these “Terms”) govern your access to and use of the Platform. Thank you
        for using the Pubky platform and the products, services and features we make available to you as part of the
        platform, including the Pubky App (collectively, the “Platform”). The terms and conditions set forth below (as
        updated and amended from time to time, and collectively with the Privacy Policy and any other materials
        explicitly incorporated by us, these “Terms”) govern your access to and use of the Platform.
        <br />
        <br />
        PLEASE REVIEW THE ARBITRATION PROVISION SET FORTH BELOW CAREFULLY, AS IT WILL REQUIRE ALL PERSONS TO RESOLVE
        DISPUTES ON AN INDIVIDUAL BASIS THROUGH FINAL AND BINDING ARBITRATION AND TO WAIVE ANY RIGHT TO PROCEED AS A
        REPRESENTATIVE OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE PROCEEDING. BY USING THE PLATFORM, YOU EXPRESSLY
        ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND ALL OF THE TERMS OF THIS PROVISION AND HAVE TAKEN TIME TO CONSIDER
        THE CONSEQUENCES OF THIS IMPORTANT DECISION.
      </Typography.Body>
      <Button.Large icon={<Icon.Check size="16" />} onClick={() => setShowModal(false)}>
        I have read and agree with the Terms of Service
      </Button.Large>
    </>
  );
}
