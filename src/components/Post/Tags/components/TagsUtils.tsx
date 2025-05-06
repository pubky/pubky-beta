// TagsUtils.tsx
import { useState, useEffect, useRef } from 'react';

import { PostTag, PostType, PostView } from '@/types/Post';
import { useAlertContext, useModal, usePubkyClientContext } from '@/contexts';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { useIsMobile } from '@/hooks/useIsMobile';

export const useTagsLogic = (post: PostView, postType: PostType) => {
  const [tags, setTags] = useState<PostTag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [loadingTags, setLoadingTags] = useState('');
  const [profileImages, setProfileImages] = useState({});
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const { pubky, setTimeline, createTag, deleteTag, setSinglePost, setReplies, replies } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { openModal, closeModal } = useModal();
  const isMobile = useIsMobile(768);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  useEffect(() => {
    if (post?.tags) setTags(post.tags);
  }, [post?.tags]);

  const updateTagsAndTimeline = (tag: string, isAdding: boolean) => {
    let newTags = tags;
    const existingTag = tags.find((t) => t.label === tag);
    let uniqueTagsChange = 0;

    if (isAdding) {
      if (!existingTag) {
        newTags = [
          {
            label: tag,
            taggers_count: 1,
            taggers: [pubky ?? ''],
            relationship: true
          },
          ...tags
        ];
        uniqueTagsChange = 1;
      } else if (!existingTag.taggers.includes(pubky ?? '')) {
        newTags = tags.map((t) =>
          t.label === tag
            ? {
                ...t,
                taggers_count: t.taggers_count + 1,
                taggers: [...t.taggers, pubky ?? ''],
                relationship: true
              }
            : t
        );
        if (existingTag.taggers_count === 0) uniqueTagsChange = 1;
      }
    } else {
      newTags = tags.map((t) =>
        t.label === tag
          ? {
              ...t,
              taggers_count: t.taggers_count - 1,
              taggers: t.taggers.filter((tg) => tg !== pubky),
              relationship: false
            }
          : t
      );
      if (existingTag?.taggers_count === 1) uniqueTagsChange = -1;
    }

    setTags(newTags);

    if (postType === 'single') {
      setSinglePost((prev) => ({
        ...prev,
        tags: newTags,
        counts: { ...prev?.counts, unique_tags: Math.max(0, prev?.counts.unique_tags + uniqueTagsChange) }
      }));
    }

    setReplies((prev) =>
      prev.map((p) =>
        p.details.id === post.details.id
          ? {
              ...p,
              tags: newTags,
              counts: { ...p.counts, unique_tags: Math.max(0, p.counts.unique_tags + uniqueTagsChange) }
            }
          : p
      )
    );

    setTimeline((prev) =>
      prev.map((p) =>
        p.details.id === post.details.id
          ? {
              ...p,
              tags: newTags,
              counts: {
                ...p.counts,
                unique_tags: Math.max(0, p.counts.unique_tags + uniqueTagsChange)
              }
            }
          : p
      )
    );
    closeModal('tags');
  };

  const handleAddTag = async (tag: string) => {
    if (!tag) return;
    setLoadingTags(tag);
    const response = await createTag(post.details.author, post.details.id, tag);
    if (response) {
      updateTagsAndTimeline(tag, true);
      setAddTagInput(false);
      setTagInput('');
    } else {
      addAlert('Something went wrong', 'warning');
    }
    setLoadingTags('');
  };

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(tag);
    await deleteTag(post.details.author, post.details.id, tag);
    updateTagsAndTimeline(tag, false);
    setLoadingTags('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.toLowerCase().replace(/\s/g, '');
    setTagInput(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTag(tagInput);
  };

  const fetchProfileImages = async () => {
    const images = {};
    const taggerPromises = tags.flatMap((tagObj) =>
      tagObj?.taggers
        ?.map((fromItem) => {
          if (fromItem && !images[fromItem]) {
            return fromItem;
          }
          return null;
        })
        .filter(Boolean)
    );

    await Promise.all(taggerPromises);
    setProfileImages(images);
  };

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
