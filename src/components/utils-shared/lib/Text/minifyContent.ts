export const minifyContent = (text: string, maxLines: number, maxLength: number = 500) => {
  // First split by lines
  const lines = text.split('\n');

  // If we have more lines than maxLines, truncate
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n') + '...';
  }

  // If the text is longer than maxChars, truncate at the last complete word
  const minifiedLines = lines.map((line) => (line.length > maxLength ? `${line.substring(0, maxLength)}...` : line));
  return minifiedLines.join('\n');
};

export default minifyContent;
