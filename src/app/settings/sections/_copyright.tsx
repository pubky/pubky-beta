'use client';

import { useState } from 'react';
import { Button, Card, Content, Input, Typography } from '@social/ui-shared';
import axios from 'axios';
import { useAlertContext } from '@/contexts';

export default function Copyright() {
  const { addAlert } = useAlertContext();
  const [isChecked, setIsChecked] = useState(true);
  const [isChecked2, setIsChecked2] = useState(false);
  const [nameOwner, setNameOwner] = useState<string>('');
  const [originalContentUrls, setOriginalContentUrls] = useState<string>('');
  const [briefDescription, setBriefDescription] = useState<string>('');
  const [infringingContentUrl, setInfringingContentUrl] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [stateProvince, setStateProvince] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      (isChecked || isChecked2) &&
      nameOwner.trim() !== '' &&
      originalContentUrls.trim() !== '' &&
      briefDescription.trim() !== '' &&
      infringingContentUrl.trim() !== '' &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      isValidEmail(email) &&
      phoneNumber.trim() !== '' &&
      streetAddress.trim() !== '' &&
      country.trim() !== '' &&
      city.trim() !== '' &&
      stateProvince.trim() !== '' &&
      zipCode.trim() !== '' &&
      signature.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = {
        nameOwner,
        originalContentUrls,
        briefDescription,
        infringingContentUrl,
        firstName,
        lastName,
        email,
        phoneNumber,
        streetAddress,
        country,
        city,
        stateProvince,
        zipCode,
        signature,
        isRightsOwner: isChecked,
        isReportingOnBehalf: isChecked2
      };

      await axios.post('/api/chatwoot', {
        message: `${JSON.stringify(formData, null, 2)}`,
        name: `${firstName} ${lastName}`,
        email: `${email}`,
        source: `Copyright Removal Request`
      });

      setLoading(false);
      // Reset form
      setNameOwner('');
      setOriginalContentUrls('');
      setBriefDescription('');
      setInfringingContentUrl('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setStreetAddress('');
      setCountry('');
      setCity('');
      setStateProvince('');
      setZipCode('');
      setSignature('');
      setIsChecked(true);
      setIsChecked2(false);
      addAlert('Request sent successfully', 'default');
    } catch (error) {
      addAlert('Error sending request', 'warning');
      console.error(error);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (newCheckedState: boolean) => {
    setIsChecked(newCheckedState);
    if (newCheckedState) {
      setIsChecked2(false);
    }
  };

  const handleCheckboxChange2 = (newCheckedState: boolean) => {
    setIsChecked2(newCheckedState);
    if (newCheckedState) {
      setIsChecked(false);
    }
  };

  return (
    <div className="w-full">
      <div className="p-8 md:p-12 bg-white bg-opacity-10 rounded-t-lg flex-col justify-start items-start gap-12 inline-flex">
        <div className="w-full flex-col justify-start items-start gap-6 flex">
          <Typography.H1>Copyright Removal Request</Typography.H1>
          <Typography.Body variant="small" className="text-opacity-80">
            Date: 01/06/2025
          </Typography.Body>
          <Typography.Body variant="small" className="text-opacity-80">
            Synonym Software, S.A. de C.V. (“Synonym”)
            <br />
            87 avenida norte, calle El Mirador, edificio Torre Futura, oficina 06, nivel 11, colonia Escalón, del
            municipio de San Salvador, departamento de San Salvador. Código postal 01101, República de El Salvador.
            <br />
            Email:{' '}
            <a href="mailto:copyright@synonym.to" className="cursor-pointer text-[#C8FF00]">
              copyright@synonym.to
            </a>
          </Typography.Body>
          <Content.Divider className="my-3" />
          <div className="w-full p-4 bg-white/10 rounded-lg inline-flex flex-col gap-6">
            <Typography.Body variant="small" className="text-opacity-80">
              Dear Synonym:
            </Typography.Body>
            <Typography.Body variant="small" className="text-opacity-80">
              We write on behalf of:
            </Typography.Body>
          </div>
          <Typography.Body variant="medium-bold">Rights Owner Information</Typography.Body>
          <div className="w-full flex flex-col xl:flex-row gap-4 xl:justify-between">
            <Input.Checkbox
              cssCheckbox="w-8 h-8"
              checked={isChecked}
              onCheckChange={handleCheckboxChange}
              text="I am the rights owner"
            />
            <Input.Checkbox
              cssCheckbox="w-8 h-8"
              checked={isChecked2}
              onCheckChange={handleCheckboxChange2}
              text="I am reporting on behalf of my organization or client"
            />
          </div>
          <div className="w-full">
            <Typography.Label className="text-uppercase text-white/30">
              Name of the rights owner{' '}
              <span className="text-xs">(This may be your full name or the name of the organization)</span>
            </Typography.Label>
            <Input.Text
              value={nameOwner}
              maxLength={50}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameOwner(e.target.value)}
              placeholder="Name of the rights owner"
              className="mt-1"
            />
          </div>
          <Content.Divider className="my-3" />
          <div className="w-full p-4 bg-white/10 rounded-lg inline-flex flex-col gap-6">
            <Typography.Body variant="small" className="text-opacity-80">
              We hereby provide notice of copyright infringements pursuant to the terms of the Digital Millennium
              Copyright Act (the “Act”) and the Pubky Terms and Conditions. Copyright Owner is the owner of the
              copyrights in the following work(s) (collectively, the “Work(s)”):
            </Typography.Body>
          </div>
          <div className="w-full flex flex-col xl:flex-row gap-8 xl:justify-between">
            <div className="w-full">
              <Input.Label value="original Content URls" />
              <Card.Primary
                background="bg-transparent"
                className="relative border border-white border-opacity-30 border-dashed mt-1"
              >
                <Input.TextArea
                  className="h-[50px]"
                  value={originalContentUrls}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) =>
                    setOriginalContentUrls((e.target as HTMLTextAreaElement).value)
                  }
                />
              </Card.Primary>
            </div>
            <div className="w-full">
              <Input.Label value="Brief description of your original content" />
              <Card.Primary
                background="bg-transparent"
                className="relative border border-white border-opacity-30 border-dashed mt-1"
              >
                <Input.TextArea
                  className="h-[50px]"
                  value={briefDescription}
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) =>
                    setBriefDescription((e.target as HTMLTextAreaElement).value)
                  }
                />
              </Card.Primary>
            </div>
          </div>
          <Content.Divider className="my-3" />
          <div className="w-full p-4 bg-white/10 rounded-lg inline-flex flex-col gap-6">
            <Typography.Body variant="small" className="text-opacity-80">
              It has come to Copyright Owner's attention that your platform (the “Platform”) displays, provides access
              to or caches materials that infringe Copyright Owner's copyrights in the Work(s). The following is a list
              of the infringing material(s) and the URL(s), if applicable, at which the infringing material(s) are
              accessible on the Platform:
            </Typography.Body>
          </div>
          <Typography.Body variant="medium-bold">Infringing work details</Typography.Body>
          <div className="w-full">
            <Input.Label value="Infringing Content URls" />
            <Card.Primary
              background="bg-transparent"
              className="relative border border-white border-opacity-30 border-dashed mt-1"
            >
              <Input.TextArea
                className="h-[50px]"
                value={infringingContentUrl}
                onInput={(e: React.FormEvent<HTMLTextAreaElement>) =>
                  setInfringingContentUrl((e.target as HTMLTextAreaElement).value)
                }
              />
            </Card.Primary>
          </div>
          <Content.Divider className="my-1" />
          <div className="w-full p-4 bg-white/10 rounded-lg inline-flex flex-col gap-6">
            <Typography.Body variant="small" className="text-opacity-80">
              We have a good faith belief that the use of the Works described in this letter are not authorized by
              Copyright Owner, any agent of Copyright Owner or any applicable law. The information in this notification
              is accurate. We swear under penalty of perjury that we are authorized to act on behalf of Copyright Owner
              with respect to the subject matter of this letter.
              <br />
              <br />
              We therefore request that you remove or disable access to the infringing materials as set forth in Section
              512(c)(1)(C), Section 512(d)(3) and/or Section 512(b)(2)(E) of the Act, as applicable, and pursuant to the
              Pubky Terms and Conditions. Please contact the undersigned no later than one week from the date of this
              copyright removal request to confirm that the infringing materials have been removed or access disabled.
              The undersigned may be contacted at the telephone number, address and email address set forth below, as
              follows:
            </Typography.Body>
          </div>
          <Typography.Body variant="medium-bold">Contact Information</Typography.Body>
          <div className="w-full flex flex-col xl:flex-row gap-8 xl:justify-between">
            <div className="w-full">
              <Input.Label value="First Name" />
              <Input.Text
                value={firstName}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                placeholder="Satoshi"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Input.Label value="Last Name" />
              <Input.Text
                value={lastName}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                placeholder="Nakamoto"
                className="mt-1"
              />
            </div>
          </div>
          <div className="w-full flex flex-col xl:flex-row gap-8 xl:justify-between">
            <div className="w-full">
              <Input.Label value="email" />
              <Input.Text
                value={email}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Input.Label value="Phone number" />
              <Input.Text
                value={phoneNumber}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                placeholder="000-000-0000"
                className="mt-1"
              />
            </div>
          </div>
          <Typography.Body variant="medium-bold">Address</Typography.Body>
          <div className="w-full flex flex-col xl:flex-row gap-8 xl:justify-between">
            <div className="w-full">
              <Input.Label value="Street address" />
              <Input.Text
                value={streetAddress}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreetAddress(e.target.value)}
                placeholder="Street number and name"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Input.Label value="Country" />
              <Input.Text
                value={country}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
                placeholder="United States"
                className="mt-1"
              />
            </div>
          </div>
          <div className="w-full flex flex-col xl:flex-row gap-8 xl:justify-between">
            <div className="w-full">
              <Input.Label value="city" />
              <Input.Text
                value={city}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                placeholder="City name"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Input.Label value="State/Province" />
              <Input.Text
                value={stateProvince}
                maxLength={30}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStateProvince(e.target.value)}
                placeholder="State name"
                className="mt-1"
              />
            </div>
          </div>
          <div className="w-full">
            <Input.Label value="Zip code" />
            <Input.Text
              value={zipCode}
              maxLength={30}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZipCode(e.target.value)}
              placeholder="000000"
              className="mt-1"
            />
          </div>
          <Content.Divider className="my-1" />
          <Typography.H2>Signature</Typography.H2>
          <div className="w-full xl:w-[350px]">
            <Input.Label value="FULL NAME AS Signature" />
            <Input.Text
              value={signature}
              maxLength={30}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignature(e.target.value)}
              placeholder="Full name"
              className="mt-1"
            />
          </div>
        </div>
      </div>
      <div className="w-full p-8 bg-white bg-opacity-5 rounded-b-lg flex-col justify-start items-start gap-12 inline-flex">
        <div className="w-full flex justify-end">
          <Button.Large
            disabled={!isFormValid()}
            loading={loading}
            className="w-auto bg-[#c8ff00] border-[#c8ff00]"
            colorText="text-[#c8ff00]"
            onClick={!isFormValid() || loading ? undefined : handleSubmit}
          >
            Submit Form
          </Button.Large>
        </div>
      </div>
    </div>
  );
}
