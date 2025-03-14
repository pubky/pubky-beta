import { PostView } from '@/types/Post';

/**
 * Function to add a tag to a post
 * @param tag Tag to be added
 * @param localPost Current post
 * @param createTag Function to create tag in backend
 * @param setLocalPost Function to update local post
 * @param addAlert Function to display alerts
 * @param tagInput Current tag input
 * @param setTagInput Function to update tag input
 * @param setAddTagInput Function to update add tag state
 * @param setLoadingTags Function to update loading state
 */
export const handleAddTag = async (
  tag: string,
  localPost: PostView,
  createTag: (author: string, postId: string, tag: string) => Promise<any>,
  setLocalPost: (post: PostView) => void,
  addAlert: (message: string, type: string) => void,
  tagInput: string,
  setTagInput: (value: string) => void,
  setAddTagInput: (value: boolean) => void,
  setLoadingTags: (value: string) => void
) => {
  if (!tag) return;

  // check if the tag already exists in the localPost.tags array, and the author is not the author of the post, and the count is greater than 0
  const tagExists = localPost.tags.some(
    (t) => t.label === tag && t.taggers.includes(localPost.details.author) && t.taggers_count > 0
  );
  if (tagExists) {
    addAlert('Tag already exists', 'warning');
    return;
  }

  setLoadingTags(tag);
  const response = await createTag(localPost.details.author, localPost.details.id, tag);
  if (response) {
    // check if the tag already exists in the localPost.tags array
    const tagExists = localPost.tags.some((t) => t.label === tag);
    if (tagExists) {
      const updatedTags = localPost.tags.map((t) =>
        t.label === tag
          ? { ...t, taggers: [...t.taggers, localPost.details.author], taggers_count: t.taggers_count + 1 }
          : t
      );
      setLocalPost({ ...localPost, tags: updatedTags });
    } else {
      const updatedTags = [...localPost.tags, { label: tag, taggers: [localPost.details.author], taggers_count: 1 }];
      setLocalPost({ ...localPost, tags: updatedTags });
    }
    if (tag === tagInput) {
      setTagInput('');
      setAddTagInput(false);
    }
  } else {
    addAlert('Something went wrong', 'warning');
  }
  setLoadingTags('');
};

/**
 * Function to remove a tag from a post
 * @param tag Tag to be removed
 * @param localPost Current post
 * @param deleteTag Function to delete tag in backend
 * @param setLocalPost Function to update local post
 * @param addAlert Function to display alerts
 * @param setLoadingTags Function to update loading state
 */
export const handleDeleteTag = async (
  tag: string,
  localPost: PostView,
  deleteTag: (author: string, postId: string, tag: string) => Promise<any>,
  setLocalPost: (post: PostView) => void,
  addAlert: (message: string, type: string) => void,
  setLoadingTags: (value: string) => void
) => {
  setLoadingTags(tag);
  const response = await deleteTag(localPost.details.author, localPost.details.id, tag);
  if (response) {
    // check if pubky already is a tagger of the tag
    const tagExists = localPost.tags.some((t) => t.taggers.includes(localPost.details.author));
    if (tagExists) {
      const updatedTags = localPost.tags.map((t) =>
        t.label === tag
          ? {
              ...t,
              taggers: t.taggers.filter((tagger) => tagger !== localPost.details.author),
              taggers_count: t.taggers_count - 1
            }
          : t
      );
      setLocalPost({ ...localPost, tags: updatedTags });
    } else {
      const updatedTags = localPost.tags.filter((t) => t.label !== tag);
      setLocalPost({ ...localPost, tags: updatedTags });
    }
  } else {
    addAlert('Something went wrong', 'warning');
  }
  setLoadingTags('');
};

export const TagsCommonFunctions = { handleAddTag, handleDeleteTag };

export default TagsCommonFunctions;
