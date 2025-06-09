import { Button, Icon, Typography } from '@social/ui-shared';

interface ContentPrivacyPolicyProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContentPrivacyPolicy({ setShowModal }: ContentPrivacyPolicyProps) {
  return (
    <div className="my-4 pr-8 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-webkit">
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Effective Date: June 19,2025
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        SCOPE
      </Typography.Body>
      <Typography.Body className="text-opacity-80" variant="medium-light">
        This Privacy Policy (“Policy”) describes how Synonym Software Ltd. treats personal information on the Pubky
        platform and the products, services and features made available as part of the platform (collectively, the
        “Platform”).
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        POLICY SUMMARY
      </Typography.Body>
      <Typography.Body className="text-opacity-80" variant="medium-light">
        This summary offers a concise overview of how Synonym Software Ltd. (“Synonym”) collects, uses, shares, and
        protects your personal information on the Pubky platform. For full details, please read the complete Privacy
        Policy.
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            What We Collect:
            <ul className="list-disc ml-6 text-opacity-80 space-y-2">
              <li>Identifiers (e.g. name, email, public keys)</li>
              <li>Contact & account data (e.g. mailing address, bio, profile picture)</li>
              <li> Commercial & payment information (e.g. wallet addresses, transaction history)</li>
              <li>Device & usage data (e.g. IP address, browser type, usage patterns)</li>
              <li> Visual & inference data (e.g. uploaded photos; inferences about preferences)</li>
            </ul>
          </li>
          <li>
            Why We Collect It:
            <ul className="list-disc ml-6 text-opacity-80 space-y-2">
              <li>To deliver, maintain, and improve the Platform and services</li>
              <li>To communicate with you (e.g. account notices, policy updates)</li>
              <li>To secure our Platform and investigate issues (e.g. fraud prevention)</li>
              <li>As required by law or with your consent</li>
            </ul>
          </li>
          <li>
            How We Share It:
            <ul className="list-disc ml-6 text-opacity-80 space-y-2">
              <li>With our subsidiaries and affiliates for internal business purposes</li>
              <li>With vendors and service providers (e.g. email processors, analytics)</li>
              <li>Publicly on the Platform when you choose to post content</li>
              <li>With successors in the event of a merger or sale</li>
              <li>When required by law (e.g. court orders, law-enforcement requests)</li>
            </ul>
          </li>
          <li>
            Your Rights & Choices:
            <ul className="list-disc ml-6 text-opacity-80 space-y-2">
              <li>Access, correct, or delete your personal data</li>
              <li>Object to or limit certain processing activities</li>
              <li>Withdraw consent where we rely on it</li>
              <li>Opt-out of “sale” or sharing for cross-context marketing (we do not currently sell or share)</li>
              <li>Control cookies and similar technologies via your browser settings</li>
            </ul>
          </li>
          <li>
            Data Retention & Transfers:
            <ul className="list-disc ml-6 text-opacity-80 space-y-2">
              <li>
                We retain your information as long as necessary to provide services, comply with legal obligations, and
                resolve disputes.
              </li>
              <li>Your data may be stored or processed in the United States or other jurisdictions.</li>
            </ul>
          </li>
          <li>
            Children & COPPA:
            <ul className="list-disc ml-6 text-opacity-80 space-y-2">
              <li>
                {' '}
                The Platform is intended for users aged 18 and older. We do not knowingly collect data from children
                under 18.
              </li>
            </ul>
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Updates & Contact:
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>We may update this Policy; material changes will be communicated as required by law.</li>
          <li>
            For questions or to exercise your rights, email{' '}
            <a className="cursor-pointer text-[#C8FF00]" href="mailto:privacy@synonym.to">
              privacy@synonym.to
            </a>
            .
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        NOTICE AT COLLECTION
      </Typography.Body>
      <Typography.Body className="text-opacity-80" variant="medium-light">
        We collect, and in the past 12 months have collected, the following categories of information from and about
        you: identifiers; commercial information; internet or similar network activity; visual information; and
        inferences drawn from other personal information. We collect these categories of information from you in order
        to provide our services to you, to run our business, to communicate with you, and as required by law. We may
        have disclosed each of these categories of personal information for a business purpose as described below. We
        have not “sold” or “shared” personal information in the past 12 months, as those terms are defined by the CCPA.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        For a description of your rights under the CCPA, and instructions on how to exercise your rights, please see the
        Your Privacy Rights section below.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        We will retain each of these categories of personal information based on several factors, including is
        reasonably necessary to: (i) provide our products and services or administer our relationship with a consumer;
        (ii) protect our business, employees, organization, and others; (iii) fulfill our legal and regulatory
        obligations; and (iv) investigate and address issues which may include safety concerns, potential security
        incidents or policy violations.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        TYPES OF INFORMATION WE COLLECT
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        We collect information from you and about you. Here are some examples of the information we may collect:
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            <span className="font-bold">Contact Information.</span> For example, we may collect your telephone number
            and email address. We may also collect your mobile phone number.
          </li>
          <li>
            <span className="font-bold">Information You Submit.</span> We may collect information when you send us a
            message through the “Contact Us” page or similar features on our Platform. It also includes collecting
            information that you publicly post via the Platform.
          </li>
          <li>
            <span className="font-bold">Payment Information.</span> We, through our vendors, may collect and store your
            payment information. This may include wallet addresses or keys.
          </li>
          <li>
            <span className="font-bold">Account Information.</span> Certain portions of the Platform allow you to create
            a user account. In connection with that account, we collect your public key. We will also collect any
            information you use to complete your profile. This may include your name, a short bio, and a picture that
            you upload.
          </li>
          <li>
            <span className="font-bold"> Device Information.</span> For example, we may collect information about the
            type of device you use to access our Platform. We may also collect your device identifier, IP address or
            mobile operating system. We may also infer your general location based on your IP address.
          </li>
          <li>
            <span className="font-bold">Other Information.</span> If you use our website, we may collect information
            about the browser you are using. We might look at what site you came from, or what site you visit when you
            leave us.
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        HOW WE COLLECT YOUR INFORMATION
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        We collect your information in different ways. Below are some examples of how we may collect your information.
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            <span className="font-bold">Directly From You.</span> For example, when you create a profile, post on the
            Platform, or submit an inquiry to us.
          </li>
          <li>
            <span className="font-bold">Passively.</span> For example, when you visit and navigate our Platform on any
            device. We may also collect information about users over time and across different websites and devices when
            you use the Platform.
          </li>
          <li>
            <span className="font-bold">From Third Parties.</span> We may receive information about you from other
            sources. For example, this may include receiving information from our business partners, including analytics
            vendors.
          </li>
          <li>
            <span className="font-bold">By Combining Information.</span> We may combine information that we collect
            offline with information we collect through our Platform. We may also combine information we collect about
            you from the different devices you use to access our Platform.
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        HOW WE USE YOUR INFORMATION
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Examples of how we may use your information include:
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            <span className="font-bold">To Run and Improve Our Platform and Business.</span> We may use your information
            to operate and improve the Platform. We may also use your information to provide you with information about
            our business.
          </li>
          <li>
            <span className="font-bold">To Respond to Your Requests or Questions.</span> This may include responding to
            your feedback.
          </li>
          <li>
            <span className="font-bold">To Communicate With You.</span> We may communicate with you about your account
            or our relationship. We may also contact you about this Policy or our Platform terms and conditions.
          </li>
          <li>
            <span className="font-bold">For Security Purposes.</span> This could include protecting our company and
            consumers who use our products and services. It may also include protecting our Platform.
          </li>
          <li>
            <span className="font-bold">As Otherwise Permitted By Law or As We May Notify You.</span>
          </li>
          <li>
            <span className="font-bold">As Requested or Directed By You.</span>
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        HOW WE SHARE YOUR INFORMATION
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        We may share your information in the following ways:
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            <span className="font-bold">Internally.</span> We may share your information with our parent, subsidiary,
            and affiliate entities.
          </li>
          <li>
            <span className="font-bold">With Our Service Providers.</span> We may share your information with third
            parties who perform services on our behalf. For example, this may include companies that send emails on our
            behalf or help us run our Platform.
          </li>
          <li>
            <span className="font-bold">On the Platform.</span> If you choose to make posts on the Platform, anything
            that you post will be posted publicly on the Platform and visible to other users.
          </li>
          <li>
            <span className="font-bold">With Any Successors to All or Part of Our Business.</span> For example, if we
            merge with, are acquired by, or sell part of our business to another entity. This may include an asset sale,
            corporate reorganization or other change of control.
          </li>
          <li>
            <span className="font-bold">To Comply With the Law or To Protect Ourselves.</span> For example, this could
            include responding to a court order or subpoena. It could also include sharing information if a government
            agency or investigatory body requests. We might share information when we are investigating a potential
            fraud.
          </li>
          <li>
            <span className="font-bold">For Other Reasons We May Describe to You. </span>
          </li>
          <li>
            <span className="font-bold">As Requested or Directed By You.</span>
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        CHILDREN UNDER 18
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        The Platform where this Policy is located is meant for adults. We do not knowingly collect personally
        identifiable data from persons under the age of 18, and strive to comply with the provisions of COPPA (The
        Children’s Online Privacy Protection Act). If you are a parent or legal guardian and think your child under 18
        has provided us with information, please contact us at{' '}
        <a className="cursor-pointer text-[#C8FF00]" href="mailto:privacy@synonym.to">
          privacy@synonym.to
        </a>
        . You can also write to us at the address listed at the end of this website Policy. Please mark your inquiries
        “COPPA Information Request.” Parents, you can learn more about how to protect children’s privacy on-line{' '}
        <a
          target="_blank"
          className="cursor-pointer text-[#C8FF00]"
          href="https://www.consumer.ftc.gov/articles/0031-protecting-your-childs-privacy-online"
        >
          here
        </a>
        .
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        CHOICES REGARDING YOUR INFORMATION
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        You have certain choices about how we use your information. Certain choices you make are browser and device
        specific.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        <span className="font-bold">Cookies & Other Tracking Technologies:</span>
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2 mb-4">
          <li>
            <span className="font-bold">Cookies:</span> You can adjust your browser to control cookies to require your
            affirmative acceptance for new cookies, automatically reject cookies and/or delete or disable existing
            cookies. How you do so depends on the type of cookie and the browser that you are using. For more
            information on how to control browser cookies,{' '}
            <a
              target="_blank"
              className="cursor-pointer text-[#C8FF00]"
              href="https://www.networkadvertising.org/understanding-online-advertising/what-are-my-options"
            >
              click here
            </a>
            . If information about your browser is not available through this page, please search your browser for
            instructions about how to opt-out of cookie collection.
          </li>
          <li>
            <span className="font-bold">Email Tools:</span> You can also change your email settings to block the
            automatic download of images in email messages, as such images may contain technologies that help us
            understand how you interact with the message.
          </li>
          <li>
            Note that deleting or blocking cookies may impact your experience on our website, as some features may not
            be available. Certain options you select are browser and device specific.
          </li>
        </ul>
        <span className="font-bold">Our Do Not Track Policy:</span>
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            <span className="font-bold">
              Some browsers have “do not track” features that allow you to tell a website not to track you. These
              features are not all uniform. We do not currently respond to those signals.
            </span>{' '}
            If you block cookies, certain features on our sites may not work. If you block or reject cookies, not all of
            the tracking described here will stop.
          </li>
          <li>Options you select are browser and device specific.</li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        YOUR PRIVACY RIGHTS
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Based on your state or country of residence, you may have the rights listed below with respect to the personal
        information that we maintain about you. We may take steps to verify your identity, as permitted or required
        under applicable law, before we process your request. Verification may include asking you to provide information
        about yourself that we can match against information already in our possession.
        <ul className="list-disc ml-6 text-opacity-80 space-y-2 mt-2">
          <li>
            <span className="font-bold">Notice.</span>This means that you can request that we disclose what personal
            information we have collected about you, including the categories of personal information, the categories of
            sources from which the personal information is collected, the business or commercial purpose for collecting,
            selling, or sharing personal information, the categories of third parties to whom we have disclosed personal
            information, and the specific pieces of personal information we have collected about you.
          </li>
          <li>
            <span className="font-bold">Access.</span> This enables you to receive a copy of the personal data we hold
            about you and to check that we are lawfully processing it.
          </li>
          <li>
            <span className="font-bold">Deletion.</span> This means that you can request that we delete personal
            information about you which we have collected from you. Note, however, that we may not always be able to
            comply with your request of erasure for specific legal reasons which will be notified to you, if applicable,
            at the time of your request.
          </li>
          <li>
            <span className="font-bold">Correction.</span> This means that you can request that we correct inaccurate
            personal information that we maintain about you.
          </li>
          <li>
            <span className="font-bold">Object to Specific Processing.</span> This means that you may object to
            processing of your personal information where we are relying on a legitimate interest (or those of a third
            party) and there is something about your particular situation which makes you want to object to processing
            on this ground as you feel it impacts on your fundamental rights and freedoms. In some cases, we may
            demonstrate that we have compelling legitimate grounds to process your information which override your
            rights and freedoms.
          </li>
          <li>
            <span className="font-bold">Withdraw Consent.</span> Where we are relying on consent to process your
            personal information, you may withdraw that consent at any time. However, this will not affect the
            lawfulness of any processing carried out before you withdraw your consent. If you withdraw your consent, we
            may not be able to provide certain products or services to you. We will advise you if this is the case at
            the time you withdraw your consent.
          </li>
          <li>
            <span className="font-bold">Limit the Use or Disclosure of Sensitive Personal Information.</span> The
            California Consumer Privacy Act (“CCPA”) provides a right for consumers to request that business limit the
            use or disclosure of their “sensitive” personal information. In our normal business operations, we do not
            process “sensitive personal information” as that term is defined under CCPA. Please do not submit this
            information to us.
          </li>
          <li>
            <span className="font-bold">Opt-Out of the Sale or Sharing of Personal Information.</span> You may have the
            right to opt out of the “sale” or sharing of personal information with third parties for cross-contextual
            marketing purposes.{' '}
            <span className="font-bold">
              We do not knowingly “sell” or “share” any personal information, including any personal information
              relating to consumers under the age of 16, as we understand those terms to be defined under applicable
              law.
            </span>
          </li>
        </ul>
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Agents that you have authorized to act on your behalf may also submit requests as instructed below. The agent
        must also provide evidence that they have your written permission to submit a request on your behalf. If we are
        unable to verify the authenticity of a request, we may ask you for more information or may deny the request.
      </Typography.Body>
      <br />
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Individuals who wish to exercise their rights under this section can contact us at{' '}
        <a className="cursor-pointer text-[#C8FF00]" href="mailto:privacy@synonym.to">
          privacy@synonym.to
        </a>
        . Please include your name, public key, and email address, and indicate you are making a “Privacy Rights”
        request. If we deny your rights request and you would like to appeal, you may contact us at{' '}
        <a className="cursor-pointer text-[#C8FF00]" href="mailto:info@synonym.to">
          info@synonym.to
        </a>
        .
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Agents that you have authorized to act on your behalf may also submit requests as instructed below. The agent
        Should you wish to report a complaint or if you feel that we have not addressed your concern in a satisfactory
        manner, you may contact the supervisory authority of your state or country.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        SECURITY
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        The Internet is not 100% secure. We cannot promise that your use of our Platform will be completely safe. We
        encourage you to use caution when using the Internet. We use reasonable means to safeguard personal information
        under our control. A user id and a password are needed to access certain areas of our Platform. It is your
        responsibility to protect your username and password.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        STORAGE AND TRANSFER OF INFORMATION
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Information we maintain may be stored in or outside of the United States. If you live outside of the United
        States, you understand and agree that we may transfer your personal information to the United States. This
        Platform is subject to the laws of the United States, which may not provide the same level of protections as
        those in your own country. Personal information processed and stored in another country, including the United
        States, may be subject to disclosure or access requests by the governments, courts or law enforcement or
        regulatory agencies in that country according to its laws.
      </Typography.Body>
      <Typography.Body className="text-opacity-80" variant="medium-light">
        By using our Platform or by providing us with personal information, you consent to any such transfer of
        information outside of your country.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        LINKS
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        Our Platform may contain links to other third-party sites that are not governed by this Policy. If you click on
        a link to a third-party site, you will be taken to a site we do not control. We are not responsible for the
        privacy practices used by third-party sites. We suggest that you read the privacy policies of those sites
        carefully. We are not responsible for these third-party sites.
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        HOW TO CONTACT US
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        If you have any questions, comments or concerns with respect to our privacy practices or this Policy, or wish to
        update your information, please feel free to contact us at{' '}
        <a className="cursor-pointer text-[#C8FF00]" href="mailto:privacy@synonym.to">
          privacy@synonym.to
        </a>
        .
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-bold">
        CHANGES IN POLICY
      </Typography.Body>
      <br />
      <Typography.Body className="text-opacity-80" variant="medium-light">
        From time to time, we may change our Policy. We will notify you of any material changes to our Policy as
        required by law. We will also post an updated copy on our Platform. Please check our Platform periodically for
        updates.
      </Typography.Body>
      <Button.Large className="mt-8" icon={<Icon.Check size="16" />} onClick={() => setShowModal(false)}>
        I have read and agree with the Privacy Policy
      </Button.Large>
    </div>
  );
}
