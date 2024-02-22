import Image from 'next/image';
import Link from 'next/link';
import {
  Header,
  Content,
  Typography,
  Button,
  Input,
  Card,
  Icon,
} from '@social/ui-shared';

export default function Index() {
  return (
    <Content.Main>
      <Header.Root>
        <Header.Logo height={48} width={167} />
        <Header.Title title={'Onboarding'} />
        <Content.Stepper currentStep={2} />
      </Header.Root>
      <Content.Grid className="h-[952px]">
        <Input.Cursor
          placeholder="Your Name"
          className="h-[174px] text-opacity-100 text-[100px] font-bold"
        />
        <Typography.PageTitle className="text-white text-opacity-50">
          @1pm3...5jkm
        </Typography.PageTitle>
        <div className="grid grid-cols-3 gap-6 pt-12">
          <Card.Primary title="Profile">
            <Typography.Label className="mt-4 mb-2 text-white text-opacity-30">
              Short bio
            </Typography.Label>
            <Input.TextArea
              placeholder="Short bio. Tell a bit about yourself."
              className="w-80 h-[422px]"
            />
          </Card.Primary>
          <Card.Primary title="Links">
            <Typography.Label className="mt-4 mb-2 text-white text-opacity-30">
              Website
            </Typography.Label>
            <Input.Text className="w-80 h-[70px]" placeholder="https://" />
            <Typography.Label className="mt-4 mb-2 text-white text-opacity-30">
              Email
            </Typography.Label>
            <Input.Text
              className="w-80 h-[70px]"
              placeholder="user@provider.com"
            />
            <Typography.Label className="mt-4 mb-2 text-white text-opacity-30">
              x (twitter)
            </Typography.Label>
            <Input.Text className="w-80 h-[70px]" placeholder="@user" />
            <Typography.Label className="mt-4 mb-2 text-white text-opacity-30">
              Telegram
            </Typography.Label>
            <Input.Text className="w-80 h-[70px]" placeholder="@user" />
          </Card.Primary>
          <Card.Primary title="Picture">
            <Image
              width={320}
              height={320}
              className="mt-6"
              alt="user"
              src="/images/Userpic.png"
            />
            <div className="pt-[40px]">
              <Link href="/onboarding/step2">
                <Button.Large icon={<Icon.Check size="20" />}>
                  Finish
                </Button.Large>
              </Link>
            </div>
          </Card.Primary>
        </div>
      </Content.Grid>
      <Content.MainBg alt="Onboard Pubky" imgSrc="/images/bg-image-2.png" />
    </Content.Main>
  );
}
