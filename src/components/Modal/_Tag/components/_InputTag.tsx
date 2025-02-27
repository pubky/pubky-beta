import EmojiPicker from '@/components/EmojiPicker';
import Post from '@/components/Post';
import { PostView } from '@/types/Post';
import { Input, Typography } from '@social/ui-shared';
import { useUtilsTag } from './_Utils';

interface InputTagProps {
  post: PostView;
  tagsError: boolean | undefined;
}

export default function InputTag({ post, tagsError }: InputTagProps) {
  const { tag, setTag, addTag, showEmojis, setShowEmojis, wrapperRefEmojis, loading } = useUtilsTag(post);

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
        <Input.Tag
          value={tag}
          onChange={setTag}
          onAddTag={addTag}
          onEmojiPickerClick={() => setShowEmojis(true)}
          loading={loading}
          autoFocus
          variant="default"
          className="w-full"
          inputClassName="flex-1 max-w-[calc(100%-100px)]"
        />
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
