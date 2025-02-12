export const isValidContent = (content: string) => {
  const regex = /[\p{L}\p{N}\p{P}\p{S}]/u;
  return regex.test(content);
};

export default isValidContent;
