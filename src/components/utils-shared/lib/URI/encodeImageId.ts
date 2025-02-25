export const encodeImageId = (image: File | string): string | null => {
  let url: string;

  if (typeof image === 'string') {
    url = image;
  } else if (image instanceof File) {
    url = URL.createObjectURL(image);
  } else {
    return null;
  }

  const parts = url.split('/');
  const id = parts.pop();

  if (image instanceof File) {
    URL.revokeObjectURL(url);
  }

  return id || null;
};

export default encodeImageId;
