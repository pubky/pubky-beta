export const minifyContent = (text: string, maxLines: number) => {
  const lines = text.split('\n');
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n') + `...`;
  }
  return text;
};

export default minifyContent;
