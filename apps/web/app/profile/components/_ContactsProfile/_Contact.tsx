import { UserProfile } from './_UserProfile';

export default function Contact({
  contacts,
  isLoading,
}: {
  contacts: string[] | [] | undefined;
  isLoading: false;
}) {
  {
    /** 
  const [initLoadingContacts, setInitLoadingContacts] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState<LoadingContacts>({});
  const [profiles, setProfiles] = useState<{ [key: string]: IUserProfile }>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;
        const following = await listFollowing(pubky);
        if (following && contacts) {
          following.following.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
            if (
              contacts.some(
                (contact) => contact.uri.replace('pubky:', '') === uri
              )
            ) {
              setFollowed((prevState) => ({
                ...prevState,
                [uri]: true,
              }));
            }
          });
        }
        setInitLoadingContacts(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowing, contacts]);

  useEffect(() => {
    async function fetchProfiles() {
      if (contacts && contacts.length > 0) {
        const profilePromises = contacts.map(async (contact) => {
          const contactId = contact.uri.replace('pubky:', '');
          const userProfile = await fetchProfile(contactId);
          return { contactId, userProfile };
        });

        const profilesArray = await Promise.all(profilePromises);
        const profilesMap: { [key: string]: IUserProfile } =
          profilesArray.reduce((acc, { contactId, userProfile }) => {
            if (userProfile) {
              acc[contactId] = userProfile;
            }
            return acc;
          }, {} as { [key: string]: IUserProfile });

        setProfiles(profilesMap);
      }
    }

    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  async function fetchProfile(pubky: string): Promise<IUserProfile | null> {
    const userProfile = await getUserIndexed(pubky);
    return userProfile;
  }

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
      setLoadingContacts((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  */
  }

  return (
    <>
      {contacts &&
        contacts.map((contact, index) => (
          <UserProfile isLoading={isLoading} key={index} contact={contact} />
        ))}
    </>
  );
}
