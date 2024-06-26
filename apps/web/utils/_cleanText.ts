export const cleanText = (text: string) => {
  return text.replace(/\n{3,}/g, '\n\n');
};

export default cleanText;
