import { Content, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import { minifyText } from '../../libs/textHelper';
import { Skeleton } from '.';
import { Followed } from '../../types';

export default function WhoFollow() {
  const { getMostFollowed } = useClientContext();
  const [hotFollowed, setHotFollowed] = useState<Followed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowed() {
      try {
        const result = await getMostFollowed();
        if (result) {
          setHotFollowed(result);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchFollowed();
  }, [getMostFollowed]);
  return (
    <div>
      <SideCard.Header title="Who to follow" />
      <SideCard.Content>
        {loading ? (
          <Skeleton.WhoFollow />
        ) : hotFollowed.length > 0 ? (
          hotFollowed.slice(0, 3).map((followed, index) => (
            <div key={index + 1}>
              <SideCard.User
                uri={followed.id}
                src={followed?.profile?.image}
                username={minifyText(followed?.profile?.name)}
                label={minifyPubky(followed.id)}
              >
                <SideCard.FollowAction />
              </SideCard.User>
              {index !== hotFollowed.length - 1 && <Content.Divider />}
            </div>
          ))
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No users yet
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
