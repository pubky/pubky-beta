export const minifyContent = (text: string, maxLines: number, maxLength: number = 500) => {
  // First split by lines
  const lines = text.split('\n');

  // If we have more lines than maxLines, truncate
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n') + '...';
  }

  // If the text is longer than maxLength, truncate at the last complete word
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }

  return text;
};

export default minifyContent;
