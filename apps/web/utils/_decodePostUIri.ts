export const decodePostUri = (pubky: string, postId: string) => {
  if (!pubky || !postId) return '';

  return `pubky:${pubky}/pubky.app/posts/${postId}`;
};

export default decodePostUri;
