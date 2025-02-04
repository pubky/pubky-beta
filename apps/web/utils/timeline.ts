import { PostView } from '@/types/Post';

export const editPost = (
  timeline: PostView[],
  postId: string,
  content: string,
) => {
  return timeline.map((post) => {
    if (post.details.id === postId) {
      return { ...post, details: { ...post.details, content } };
    }
    return post;
  });
};

export const deletePost = (timeline: PostView[], postId: string) => {
  return timeline.filter((post) => post.details.id !== postId);
};

export const addPost = (timeline: PostView[], post: PostView) => {
  return [...timeline, post];
};

export const getPost = (timeline: PostView[], postId: string) => {
  return timeline.find((post) => post.details.id === postId);
};

export const getPosts = (timeline: PostView[], postIds: string[]) => {
  return timeline.filter((post) => postIds.includes(post.details.id));
};
