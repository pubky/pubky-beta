import { Icon, Typography } from '@social/ui-shared';

export default function MutedUsers() {
  return (
    <div className="p-12 bg-white bg-opacity-10 rounded-2xl flex-col justify-start items-start gap-12 inline-flex">
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.SpeakerSimpleSlash size="24" />
          <Typography.H2>Muted users</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Here is an overview of all users you muted. You can choose to unmute
          users if you want.
        </Typography.Body>
        <Typography.H2 className="flex self-center mt-[50px] font-normal text-opacity-20 text-center">
          No muted users yet
        </Typography.H2>
        {/**<SideCard.User
          uri="dmhebqrrfiacj1fkqemun9fnmxqas9ff6qgi39duemwe3s89sf9y"
          src={'/images/Userpic.png'}
          username={Utils.minifyText('Test account name')}
          label={Utils.minifyPubky(
            'dmhebqrrfiacj1fkqemun9fnmxqas9ff6qgi39duemwe3s89sf9y'
          )}
        >
          <Button.Medium
            icon={<Icon.SpeakerSimpleSlash size="16" />}
            className="w-auto"
          >
            Unmute
          </Button.Medium>
        </SideCard.User>
        */}
      </div>
    </div>
  );
}
