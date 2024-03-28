// function that gets a pubkey and turn into @xxxxx...xxxxx
export const minifyPubky = (pubky: string | null) => {
  if (!pubky) return '';

  const handler = pubky.slice(0, 4) + '...' + pubky.slice(-4);

  return `@${handler}`;
};

export const encodePostUri = (uri: string) => {
  // transform this type of uri: pubky:xxx/pubky.app/posts/yyy
  // into this: xxx/yyy

  if (!uri) return '';

  const parts = uri.split('/');

  if (parts.length < 4) return '';

  const pubky = parts[0].split(':')[1];
  const postId = parts[3];

  if (!pubky || !postId) return '';

  return `/post/${pubky}/${postId}`;
};

export const decodePostUri = (pubky: string, postId: string) => {
  if (!pubky || !postId) return '';

  return `pubky:${pubky}/pubky.app/posts/${postId}`;
};
