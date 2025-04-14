export const extractHashtags = (text: string) => {
  // Match hashtags that are:
  // 1. At the start of the text (^) or after whitespace (\s)
  // 2. Followed by a # symbol
  // 3. Followed by one or more word characters (letters, numbers, underscores)
  // 4. Stop at whitespace or end of string
  const regex = /(?:^|\s)#([a-zA-Z0-9_]+)(?=\s|$)/g;
  
  const matches = [];
  let match;
  
  // Reset regex lastIndex to ensure we start from the beginning
  regex.lastIndex = 0;
  
  while ((match = regex.exec(text)) !== null) {
    // Skip if the hashtag is part of a URL
    if (!text.substring(0, match.index).includes('http')) {
      matches.push(match[1]);
    }
  }
  
  return matches;
};

export default extractHashtags;
