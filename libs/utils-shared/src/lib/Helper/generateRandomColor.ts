export const generateRandomColor = (str: string) => {
  const hash = Array.from(str).reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);
  const color = ['00', 'FF'][Math.abs(hash) % 2];
  const randomHex = Math.abs(hash).toString(16).slice(0, 2).padStart(2, '0');
  return `#${color}${randomHex}${color === 'FF' ? '00' : 'FF'}`;
};

export default generateRandomColor;
