// Helper function to combine compressed video with original audio
async function combineVideoWithAudio(videoBlob: Blob, originalFile: File, mimeType: string): Promise<File> {
  return new Promise((resolve, reject) => {
    // Create canvas for video
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject('No canvas context available');
      return;
    }

    // Create video element for compressed video
    const videoElement = document.createElement('video');
    const videoUrl = URL.createObjectURL(videoBlob);
    videoElement.src = videoUrl;
    videoElement.muted = true;
    videoElement.volume = 0;

    // Create video element for original file (for audio)
    const audioElement = document.createElement('video');
    const audioUrl = URL.createObjectURL(originalFile);
    audioElement.src = audioUrl;
    audioElement.muted = true;
    audioElement.volume = 0;

    // Wait for both videos to load
    let videosLoaded = 0;
    const onVideoLoad = () => {
      videosLoaded++;
      if (videosLoaded === 2) {
        startRecording();
      }
    };

    videoElement.onloadedmetadata = onVideoLoad;
    audioElement.onloadedmetadata = onVideoLoad;

    videoElement.onerror = () => reject('Error loading compressed video');
    audioElement.onerror = () => reject('Error loading original video');

    videoElement.load();
    audioElement.load();

    function startRecording() {
      try {
        // Set canvas dimensions to match video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Create MediaStream from canvas (video track)
        const videoStream = canvas.captureStream();

        // Create MediaStream from audio element (audio track) using type assertion
        const audioStream = (audioElement as any).captureStream();

        // Combine video and audio streams
        const combinedStream = new MediaStream();

        // Add video track from canvas
        const videoTracks = videoStream.getVideoTracks();
        if (videoTracks.length > 0) {
          combinedStream.addTrack(videoTracks[0]);
        }

        // Add audio track from original video
        const audioTracks = audioStream.getAudioTracks();
        if (audioTracks.length > 0) {
          combinedStream.addTrack(audioTracks[0]);
        }

        // Create MediaRecorder for combined stream
        const recorder = new MediaRecorder(combinedStream, {
          mimeType: mimeType
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: mimeType });
          const finalFile = new File([finalBlob], originalFile.name.replace(/\.[^/.]+$/, '') + '.mp4', {
            type: mimeType,
            lastModified: Date.now()
          });

          // Clean up URLs
          URL.revokeObjectURL(videoUrl);
          URL.revokeObjectURL(audioUrl);

          resolve(finalFile);
        };

        recorder.onerror = (event) => {
          URL.revokeObjectURL(videoUrl);
          URL.revokeObjectURL(audioUrl);
          reject('Error during recording: ' + event);
        };

        // Start recording
        recorder.start();

        // Play both videos simultaneously
        videoElement.currentTime = 0;
        audioElement.currentTime = 0;
        videoElement.play();
        audioElement.play();

        // Draw video frames to canvas
        const drawFrame = () => {
          if (videoElement.ended || videoElement.paused) {
            recorder.stop();
            return;
          }

          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawFrame);
        };

        drawFrame();

        // Stop recording when video ends
        videoElement.onended = () => {
          recorder.stop();
        };

        audioElement.onended = () => {
          recorder.stop();
        };
      } catch (error) {
        URL.revokeObjectURL(videoUrl);
        URL.revokeObjectURL(audioUrl);
        reject('Error creating combined stream: ' + error);
      }
    }
  });
}

// Utility to resize and compress a video file to fit within a maximum file size while maintaining aspect ratio
// Note: This function compresses video without audio. If audio preservation is needed, consider using the original file.
export async function resizeVideoFile(file: File, maxSizeInBytes: number = 20 * 1024 * 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    // If the original file is already small enough, return it as-is to preserve audio
    if (file.size <= maxSizeInBytes) {
      resolve(file);
      return;
    }

    // Create a temporary video element for compression (muted)
    const compressionVideo = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject('No canvas context available');
      return;
    }

    // Create object URL for the video
    const videoUrl = URL.createObjectURL(file);

    // Mute the compression video to prevent audio during compression
    compressionVideo.muted = true;
    compressionVideo.volume = 0;

    compressionVideo.onloadedmetadata = () => {
      // Start with original dimensions
      let { videoWidth, videoHeight } = compressionVideo;
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
          const compressedVideoBlob = new Blob(chunks, { type: options.mimeType || 'video/mp4' });

          // Check if file size is within limit
          if (compressedVideoBlob.size <= maxSizeInBytes) {
            // Now we need to combine the compressed video with the original audio
            combineVideoWithAudio(compressedVideoBlob, file, options.mimeType || 'video/mp4')
              .then((finalFile) => {
                URL.revokeObjectURL(videoUrl);
                resolve(finalFile);
              })
              .catch((error) => {
                // If audio combination fails, return video without audio
                const compressedFile = new File([compressedVideoBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
                  type: options.mimeType || 'video/mp4',
                  lastModified: Date.now()
                });
                URL.revokeObjectURL(videoUrl);
                resolve(compressedFile);
              });
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
        compressionVideo.currentTime = 0;
        compressionVideo.play();

        const drawFrame = () => {
          if (compressionVideo.ended || compressionVideo.paused) {
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(compressionVideo, 0, 0, newWidth, newHeight);
          requestAnimationFrame(drawFrame);
        };

        drawFrame();
      };

      // Start compression process
      compressVideo();
    };

    compressionVideo.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject('Error loading video file');
    };

    compressionVideo.src = videoUrl;
    compressionVideo.load();
  });
}
