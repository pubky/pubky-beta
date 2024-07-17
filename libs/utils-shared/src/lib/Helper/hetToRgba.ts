export const hexToRgba = (hex: string, alpha: number) => {
  const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default hexToRgba;
