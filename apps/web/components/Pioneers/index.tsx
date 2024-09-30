import { SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { usePioneerUsers } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';

export default function Pioneers() {
  const { pubky } = usePubkyClientContext();
  const { data, isLoading, isError } = usePioneerUsers(pubky, 0, 3);
  const pioneers = data;

  if (isError) console.error(isError);

  return (
    <div className="my-6">
      <SideCard.Header title="Pioneers" />
      <SideCard.Content className="flex flex-col gap-2">
        {isLoading ? (
          <Skeletons.Simple />
        ) : pioneers && pioneers.length > 0 ? (
          <>
            {pioneers.slice(0, 3).map((pioneers, index: number) => {
              return (
                <div key={index}>
                  <SideCard.User
                    uri={pioneers.details.id.replace('pubky:', '')}
                    uriImage={pioneers?.details?.image || '/images/Userpic.png'}
                    username={
                      pioneers?.details?.name &&
                      Utils.minifyText(pioneers?.details?.name, 15)
                    }
                    // label={Utils.minifyPubky(friend.uri.replace('pubky:', ''))}
                    postsCount={pioneers?.counts?.posts}
                    tagsCount={pioneers?.counts?.tags}
                  />
                </div>
              );
            })}
            {/**
            <SideCard.Action
              icon={<Icon.UsersLeft size="16" color="gray" />}
              disabled
              text="See All"
            />
            */}
          </>
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No pioneers to show
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
