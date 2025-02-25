export const encodePostUri = (uri: string) => {
  // transform this type of uri: pubky:xxx/pubky.app/posts/yyy
  // into this: xxx/yyy

  if (!uri) return '';

  const cleanUri = uri.slice(8);

  const parts = cleanUri.split('/');

  const publicKey = parts[0];
  const postId = parts[parts.length - 1];

  const encodedUri = `/post/${publicKey}/${postId}`;

  return encodedUri;
};

export default encodePostUri;
