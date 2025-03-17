'use client';

import { useState, useEffect } from 'react';

import { PostTag, PostView } from '@/types/Post';
import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { TagsCommonFunctions } from './_TagsCommonFunctions';

export const TagsUtils = (post: PostView) => {
  const [tags, setTags] = useState<PostTag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loadingTags, setLoadingTags] = useState('');
  const [profileImages, setProfileImages] = useState({});
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const { pubky, setTimeline, createTag, deleteTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { openModal } = useModal();
  const isMobile = useIsMobile();
  const { useEmojiPicker } = TagsCommonFunctions;
  const { showEmojis, setShowEmojis, wrapperRefEmojis } = useEmojiPicker();

  const handleAddTag = async (tag: string) => {
    if (!tag) return;
    setLoadingTags(tag);
    const response = await createTag(pubky, post.details.id, tag);
    if (response) {
      TagsCommonFunctions.updateTagsAndTimeline(tag, true, tags, pubky, setTags, setTimeline, post);
      setAddTagInput(false);
      setTagInput('');
    } else {
      addAlert('Something went wrong', 'warning');
    }
    setLoadingTags('');
  };

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(tag);
    await deleteTag(pubky, post.details.id, tag);
    TagsCommonFunctions.updateTagsAndTimeline(tag, false, tags, pubky, setTags, setTimeline, post);
    setLoadingTags('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = TagsCommonFunctions.sanitizeTagInput(e.target.value);
    setTagInput(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTag(tagInput);
  };

  const fetchProfileImages = async () => {
    const images = {};
    const taggerPromises = tags.flatMap((tagObj) =>
      tagObj?.taggers
        ?.map(async (fromItem) => {
          if (fromItem && !images[fromItem]) {
            try {
              const profileImages = await TagsCommonFunctions.fetchProfileImages(
                { ...tagObj, taggers: [fromItem] },
                pubky
              );
              if (profileImages.length > 0) {
                images[fromItem] = profileImages[0];
              }
            } catch (error) {
              images[fromItem] = '/images/webp/Userpic.webp';
            }
          }
          return null;
        })
        .filter(Boolean)
    );

    await Promise.all(taggerPromises);
    setProfileImages(images);
  };

  useEffect(() => {
    if (post?.tags) setTags(post.tags);
  }, [post?.tags]);

  useEffect(() => {
    if (tags.length > 0) fetchProfileImages();
  }, [tags, pubky]);

  return {
    tags,
    tagInput,
    setTagInput,
    showEmojis,
    profileImages,
    addTagInput,
    setAddTagInput,
    setShowEmojis,
    loadingTags,
    handleAddTag,
    handleDeleteTag,
    handleInputChange,
    handleKeyDown,
    wrapperRefEmojis,
    openModal,
    isMobile
  };
};

export default TagsUtils;
