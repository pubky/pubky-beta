export const extractHashtags = (text: string) => {
  const regex = /#[a-zA-Z0-9_]+/g;
  const matches = text.match(regex) || [];
  return matches.map((hashtag) => hashtag.slice(1));
};

export default extractHashtags;
