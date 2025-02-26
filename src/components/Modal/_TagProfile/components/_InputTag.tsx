import EmojiPicker from '@/components/EmojiPicker';
import { Button, Icon, Input, SideCard } from '@social/ui-shared';
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
  const { showEmojis, setShowEmojis, wrapperRefEmojis, setTag, tag, inputRef, loading, handleChange, addProfileTag } =
    useUtilsTag({ profileTags, setProfileTags, pubkyUser, user });

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
        <div className="flex items-center h-[70px] rounded-2xl border border-white border-opacity-30 border-dashed bg-transparent">
          <input
            ref={inputRef}
            type="text"
            placeholder="tag"
            className="h-full flex-1 max-w-[calc(100%-100px)] bg-transparent outline-none text-white text-opacity-80 text-[17px] pl-6 pr-1 font-normal font-InterTight leading-snug tracking-wide"
            value={tag}
            maxLength={20}
            autoFocus
            disabled={loading}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addProfileTag(tag);
              }
            }}
          />
          <div className="flex items-center pr-4">
            <Button.Action
              id="add-btn"
              icon={loading ? <Icon.LoadingSpin size="18" /> : <Icon.Plus size="18" />}
              variant="custom"
              size="medium"
              disabled={loading}
              className={tag ? 'flex' : 'hidden'}
              onClick={() => {
                addProfileTag(tag);
              }}
            />
            <Button.Action
              variant="custom"
              icon={<Icon.Smiley size="32" />}
              className="hidden ml-2 lg:flex"
              disabled={loading}
              size="medium"
              onClick={(event) => {
                event.stopPropagation();
                setShowEmojis(true);
              }}
            />
          </div>
        </div>
      </div>
      {user && pubkyUser && (
        <SideCard.User
          uri={pubkyUser}
          className="mt-6"
          uriImage={user?.details?.image || '/images/webp/Userpic.webp'}
          username={Utils.minifyText(user?.details?.name, 16)}
          label={Utils.minifyPubky(pubkyUser)}
        />
      )}
    </div>
  );
}
