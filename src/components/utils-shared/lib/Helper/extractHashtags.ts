export const extractHashtags = (text: string) => {
  // Match hashtags that are:
  // 1. At the start of the text (^) or after whitespace or newline (\s)
  // 2. Followed by a # symbol
  // 3. Followed by one or more word characters (letters, numbers, underscores, hyphens, and special characters)
  // 4. Stop at whitespace, newline or end of string
  const regex = /(?:^|\s|\n)#([a-zA-Z0-9_]+|[^\s\n]+)(?=\s|\n|$)/g;

  const matches = [];
  let match;

  // Reset regex lastIndex to ensure we start from the beginning
  regex.lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add the hashtag to matches
    matches.push(match[1]);
  }

  return matches;
};

export default extractHashtags;
