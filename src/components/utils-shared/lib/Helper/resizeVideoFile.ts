// Utility to resize and compress a video file to fit within a maximum file size while maintaining aspect ratio
export async function resizeVideoFile(file: File, maxSizeInBytes: number = 20 * 1024 * 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject('No canvas context available');
      return;
    }

    // Create object URL for the video
    const videoUrl = URL.createObjectURL(file);

    // Mute the video to prevent audio during compression
    video.muted = true;
    video.volume = 0;

    video.onloadedmetadata = () => {
      // Start with original dimensions
      let { videoWidth, videoHeight } = video;
      let quality = 0.8; // Start with good quality
      let scale = 1;
      let bitrate = 1000000; // Start with 1Mbps bitrate

      const compressVideo = () => {
        // Calculate new dimensions
        const newWidth = Math.round(videoWidth * scale);
        const newHeight = Math.round(videoHeight * scale);

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Create MediaRecorder with compression settings
        const stream = canvas.captureStream();
        const options: MediaRecorderOptions = {
          mimeType: 'video/mp4',
          videoBitsPerSecond: bitrate
        };

        // Fallback to WebM if MP4 is not supported
        if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
          options.mimeType = 'video/webm;codecs=vp9';
        }

        // Fallback to VP8 if VP9 is not supported
        if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
          options.mimeType = 'video/webm;codecs=vp8';
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: options.mimeType || 'video/mp4' });

          // Check if file size is within limit
          if (compressedBlob.size <= maxSizeInBytes) {
            // Create new file with compressed video
            const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
              type: options.mimeType || 'video/mp4',
              lastModified: Date.now()
            });

            URL.revokeObjectURL(videoUrl);
            resolve(compressedFile);
          } else {
            // If still too large, reduce quality or scale
            if (quality > 0.1) {
              quality -= 0.1;
              bitrate = Math.max(100000, bitrate * 0.8); // Reduce bitrate but keep minimum
              compressVideo();
            } else if (scale > 0.3) {
              // If quality is already very low, reduce scale
              scale *= 0.9;
              quality = 0.8; // Reset quality
              bitrate = Math.max(100000, bitrate * 0.8);
              compressVideo();
            } else {
              // If we can't compress further, reject
              URL.revokeObjectURL(videoUrl);
              reject('Video cannot be compressed to the required size');
            }
          }
        };

        mediaRecorder.onerror = (event) => {
          URL.revokeObjectURL(videoUrl);
          reject('Error during video compression: ' + event);
        };

        // Start recording
        mediaRecorder.start();

        // Play video and draw frames to canvas
        video.currentTime = 0;
        video.play();

        const drawFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(video, 0, 0, newWidth, newHeight);
          requestAnimationFrame(drawFrame);
        };

        drawFrame();
      };

      // Start compression process
      compressVideo();
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject('Error loading video file');
    };

    video.src = videoUrl;
    video.load();
  });
}
