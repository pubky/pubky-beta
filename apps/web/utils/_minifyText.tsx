export const minifyText = (name: string, maxLength: number = 12) => {
  const minifyName =
    name?.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  return minifyName;
};

export default minifyText;
