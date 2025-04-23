export const truncateTag = (text: string, maxLength: number = 20) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default truncateTag;
