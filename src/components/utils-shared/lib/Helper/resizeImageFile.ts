// Utility to resize an image file to fit within a maximum file size while maintaining aspect ratio
export async function resizeImageFile(file: File, maxSizeInBytes: number = 5 * 1024 * 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return reject('No file data');
      img.src = e.target.result as string;
    };

    img.onload = () => {
      let { width, height } = img;
      let quality = 0.9; // Start with high quality
      let scale = 1;

      const resizeAndCompress = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to blob with current quality
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('Failed to create blob');

            // Check if file size is within limit
            if (blob.size <= maxSizeInBytes) {
              // Create new file with resized image
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              // If still too large, reduce quality or scale
              if (quality > 0.1) {
                quality -= 0.1;
                // Try again with lower quality
                canvas.toBlob(
                  (newBlob) => {
                    if (!newBlob) return reject('Failed to create blob');
                    if (newBlob.size <= maxSizeInBytes) {
                      const resizedFile = new File([newBlob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                      });
                      resolve(resizedFile);
                    } else {
                      // If still too large, reduce scale
                      scale *= 0.9;
                      resizeAndCompress();
                    }
                  },
                  'image/jpeg',
                  quality
                );
              } else {
                // If quality is already very low, reduce scale
                scale *= 0.9;
                quality = 0.9; // Reset quality
                resizeAndCompress();
              }
            }
          },
          'image/jpeg',
          quality
        );
      };

      resizeAndCompress();
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
