export async function stripImageMetadata(file: File): Promise<File> {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const outputType = supportedTypes.includes(file.type) ? file.type : 'image/jpeg';

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (!reader.result) {
        reject(new Error('No file data'));
        return;
      }
      img.src = reader.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }
        const cleanFile = new File([blob], file.name, {
          type: outputType,
          lastModified: Date.now()
        });
        resolve(cleanFile);
      }, outputType);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
