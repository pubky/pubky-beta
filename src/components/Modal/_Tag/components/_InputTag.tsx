import EmojiPicker from '@/components/EmojiPicker';
import Post from '@/components/Post';
import { PostView } from '@/types/Post';
import { Button, Icon, Input, Typography } from '@social/ui-shared';
import { useUtilsTag } from './_Utils';

interface InputTagProps {
  post: PostView;
  tagsError: boolean | undefined;
}

export default function InputTag({ post, tagsError }: InputTagProps) {
  const { tag, setTag, handleChange, addTag, showEmojis, setShowEmojis, wrapperRefEmojis, loading, inputRef } =
    useUtilsTag(post);

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
      <div className="w-full md:w-[500px] mt-2">
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
                addTag(tag);
              }
            }}
          />
          <div className="flex items-center pr-4">
            <Button.Action
              id="add-btn"
              icon={loading ? <Icon.LoadingSpin size="18" /> : <Icon.Plus size="18" />}
              className={tag ? 'flex' : 'hidden'}
              variant="custom"
              size="medium"
              disabled={loading}
              onClick={() => {
                addTag(tag);
              }}
            />
            <Button.Action
              variant="custom"
              icon={<Icon.Smiley size="32" />}
              size="medium"
              className="hidden ml-2 lg:flex"
              disabled={loading}
              onClick={(event) => {
                event.stopPropagation();
                setShowEmojis(true);
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 w-full md:w-[500px] hidden md:flex">
        <Post post={post} repostView />
      </div>
      {tagsError && (
        <Typography.Body variant="small" className="text-[#e95164] mt-4">
          Max 4 tags
        </Typography.Body>
      )}
    </div>
  );
}
