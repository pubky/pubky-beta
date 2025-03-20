import EmojiPicker from '@/components/EmojiPicker';
import { Input, SideCard } from '@social/ui-shared';
import { useUtilsTag } from './_Utils';
import { UserTags, UserView } from '@/types/User';
import { Utils } from '@social/utils-shared';

interface InputTagProps {
  profileTags: UserTags[];
  setProfileTags: React.Dispatch<React.SetStateAction<UserTags[]>>;
  pubkyUser?: string;
  user?: UserView | null;
}

export default function InputTag({ profileTags, setProfileTags, pubkyUser, user }: InputTagProps) {
  const { showEmojis, setShowEmojis, wrapperRefEmojis, setTag, tag, loading, addProfileTag } = useUtilsTag({
    profileTags,
    setProfileTags,
    pubkyUser,
    user
  });

  return (
    <div>
      {showEmojis && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" onClick={() => setShowEmojis(false)} />
          <div
            id="emoji-picker"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
            ref={wrapperRefEmojis}
          >
            <EmojiPicker
              onEmojiSelect={(emojiObject) => {
                setTag(tag + emojiObject.native);
                setShowEmojis(false);
              }}
              maxLength={20}
              currentInput={tag}
            />
          </div>
        </>
      )}
      <Input.Label value="New tag" />
      <div className="w-full lg:w-96 mt-2">
        <Input.Tag
          value={tag}
          onChange={setTag}
          onAddTag={addProfileTag}
          onEmojiPickerClick={() => setShowEmojis(true)}
          loading={loading}
          autoFocus
          variant="default"
          className="w-full"
        />
      </div>
      {user && pubkyUser && (
        <SideCard.User
          uri={pubkyUser}
          className="mt-6"
          username={Utils.minifyText(user?.details?.name, 16)}
          label={Utils.minifyPubky(pubkyUser)}
        />
      )}
    </div>
  );
}
