const svgToPng = (svgCode: string, size = 200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      ctx && ctx.drawImage(img, 0, 0);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          resolve(pngBlob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }

        URL.revokeObjectURL(svgUrl);
      }, 'image/png');
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG into Image element'));
      URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
  });
};

export default svgToPng;
