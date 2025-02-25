export const encodePostUri2 = (uri: string) => {
  if (uri.startsWith('pubky://')) {
    const trimmedUrl = uri.slice(8);

    const parts = trimmedUrl.split('/pub/pubky.app/posts/');

    if (parts.length === 2) {
      const part1 = parts[0];
      const part2 = parts[1];
      return `/post/${part1}/${part2}`;
    }
  }
  return 'URI not valid';
};

export default encodePostUri2;
