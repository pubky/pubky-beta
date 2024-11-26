import { Suspense } from 'react';
import { Typography } from '@social/ui-shared';
import Skeletons from '@/components/Skeletons';
import { TContacts } from '@/types';
import Root from './_Root';
import Contact from './_Contact';
import {} from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { useStreamUsers } from '@/hooks/useStream';

type ContactsContentProps = {
  contacts: TContacts;
  creatorPubky?: string;
};

const ContactsContent = ({ contacts, creatorPubky }: ContactsContentProps) => {
  const { pubky } = usePubkyClientContext();
  const usePubky = creatorPubky ?? pubky;
  const {
    data: contactUsers,
    isLoading,
    isError,
  } = useStreamUsers(usePubky ?? '', pubky ?? '', contacts);

  if (isError) console.error(isError);
  {
    /** 
  const [loading, setLoading] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsUsers, setContactsUsers] = useState<
    IFollowingResponse | IFollowersResponse | IFriendsResponse | null
  >(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (!pubky) return;

        let contactsFollowers;
        let contactsFollowing;

        if (creatorPubky) {
          contactsFollowers = await listFollowers(creatorPubky);
          contactsFollowing = await listFollowing(creatorPubky);
        } else {
          contactsFollowers = await listFollowers(pubky);
          contactsFollowing = await listFollowing(pubky);
        }

        const followersIds = new Set(
          contactsFollowers?.followers?.map((follower) =>
            follower.uri.replace('pubky:', '')
          ) || []
        );

        const mutualContacts =
          contactsFollowing?.following?.filter((user) =>
            followersIds.has(user.uri.replace('pubky:', ''))
          ) || [];

        const contactsFriends = {
          count: mutualContacts.length,
          friends: mutualContacts,
        };

        if (contacts === 'following') {
          setContactsUsers(contactsFollowing);
        } else if (contacts === 'followers') {
          setContactsUsers(contactsFollowers);
        } else if (contacts === 'friends') {
          setContactsUsers(contactsFriends);
        }

        setLoadingContacts(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  let contactsToShow:
    | IFollowingResponse['following']
    | IFollowersResponse['followers']
    | IFriendsResponse['friends']
    | [] = [];

  if (!loadingContacts && contactsUsers) {
    if (contacts === 'following' && 'following' in contactsUsers) {
      contactsToShow = contactsUsers.following || [];
    } else if (contacts === 'followers' && 'followers' in contactsUsers) {
      contactsToShow = contactsUsers.followers || [];
    } else if (contacts === 'friends' && 'friends' in contactsUsers) {
      contactsToShow = contactsUsers.friends || [];
    }
  }
    */
  }

  return (
    <>
      {isLoading ? (
        <div className="mt-12">
          <Skeletons.Simple />
        </div>
      ) : contactUsers && contactUsers?.length > 0 ? (
        <Root>
          <Contact contacts={contactUsers} isLoading={isLoading} />
        </Root>
      ) : contacts === 'followers' ? (
        <Typography.H2
          id="profile-no-followers"
          className="mt-[100px] font-normal text-opacity-50 text-center"
        >
          No followers yet
        </Typography.H2>
      ) : contacts === 'following' ? (
        <Typography.H2
          id="profile-no-following"
          className="mt-[100px] font-normal text-opacity-50 text-center"
        >
          No following yet
        </Typography.H2>
      ) : contacts === 'friends' ? (
        <Typography.H2
          id="profile-no-friends"
          className="mt-[100px] font-normal text-opacity-50 text-center"
        >
          No friends yet
        </Typography.H2>
      ) : (
        <Typography.H2
          id="profile-no-contacts"
          className="mt-[100px] font-normal text-opacity-50 text-center"
        >
          No contacts yet
        </Typography.H2>
      )}
    </>
  );
};

export default function ContactsProfile({
  contacts,
  creatorPubky,
}: ContactsContentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactsContent contacts={contacts} creatorPubky={creatorPubky} />
    </Suspense>
  );
}
