export const isValidContent = (content: string) => {
  const regex = /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/;
  return regex.test(content);
};

export default isValidContent;
