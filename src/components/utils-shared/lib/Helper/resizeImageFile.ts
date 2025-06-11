// Utility to resize an image file maintaining aspect ratio and compress to JPEG
export async function resizeImageFile(file: File, maxSize: number = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject('No file data');
      img.src = e.target.result as string;
    };

    img.onload = () => {
      let { width, height } = img;

      // Don't resize if image is already smaller than maxSize
      if (width <= maxSize && height <= maxSize) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0, width, height);
        // Use higher quality JPEG
        resolve(canvas.toDataURL('image/jpeg', 0.5));
        return;
      }

      // Resize only if image is larger than maxSize
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');
      ctx.drawImage(img, 0, 0, width, height);
      // Use higher quality JPEG
      resolve(canvas.toDataURL('image/jpeg', 0.5));
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
