import EmojiPicker from '@/components/EmojiPicker';
import Post from '@/components/Post';
import { PostType, PostView } from '@/types/Post';
import { Input, Typography } from '@social/ui-shared';
import { useUtilsTag } from './_Utils';

interface InputTagProps {
  post: PostView;
  tagsError: boolean | undefined;
  postType: PostType;
}

export default function InputTag({ post, tagsError, postType }: InputTagProps) {
  const { tag, setTag, addTag, showEmojis, setShowEmojis, wrapperRefEmojis, loading, inputRef } = useUtilsTag(
    post,
    postType
  );

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
          ref={inputRef}
          value={tag}
          onChange={setTag}
          onAddTag={addTag}
          onEmojiPickerClick={() => setShowEmojis(true)}
          loading={loading}
          autoFocus
          variant="default"
          className="w-full"
        />
      </div>
      <div className="mt-4 w-full md:w-[500px] hidden md:flex">
        <Post post={post} repostView postType={postType} />
      </div>
      {tagsError && (
        <Typography.Body variant="small" className="text-[#e95164] mt-4">
          Max 4 tags
        </Typography.Body>
      )}
    </div>
  );
}
