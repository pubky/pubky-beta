// Helper function to resize and compress a video file to fit within a maximum file size while maintaining aspect ratio
// This function now processes video and audio in a single pass for better performance

// Extend HTMLVideoElement interface to include captureStream method
interface HTMLVideoElementWithCapture extends HTMLVideoElement {
  captureStream?(): MediaStream;
}

// Queue system to handle multiple video compressions sequentially
let compressionQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

async function processCompressionQueue() {
  if (isProcessingQueue || compressionQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (compressionQueue.length > 0) {
    const compressionTask = compressionQueue.shift();
    if (compressionTask) {
      try {
        await compressionTask();
      } catch (error) {
        console.error('Error in compression queue:', error);
      }
    }
  }

  isProcessingQueue = false;
}

export async function resizeVideoFile(file: File, maxSizeInBytes: number = 20 * 1024 * 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    // If the original file is already small enough, return it as-is
    if (file.size <= maxSizeInBytes) {
      resolve(file);
      return;
    }

    const compressionTask = async () => {
      return new Promise<void>((taskResolve, taskReject) => {
        // Create video elements
        const videoElement = document.createElement('video') as HTMLVideoElementWithCapture;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          taskReject('No canvas context available');
          return;
        }

        // Create object URL for the video
        const videoUrl = URL.createObjectURL(file);

        // Configure video element - mute during compression but keep audio track
        videoElement.muted = true; // Mute during compression to avoid hearing audio
        videoElement.volume = 0;

        videoElement.onloadedmetadata = () => {
          // Start with original dimensions
          let { videoWidth, videoHeight } = videoElement;
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

            // Create MediaStream from canvas (video track)
            const videoStream = canvas.captureStream();

            // Combine video and audio streams
            const combinedStream = new MediaStream();

            // Add video track from canvas
            const videoTracks = videoStream.getVideoTracks();
            if (videoTracks.length > 0) {
              combinedStream.addTrack(videoTracks[0]);
            }

            // Try to add audio track from original video if captureStream is supported
            try {
              if (videoElement.captureStream && typeof videoElement.captureStream === 'function') {
                const audioStream = videoElement.captureStream();
                const audioTracks = audioStream.getAudioTracks();
                if (audioTracks.length > 0) {
                  combinedStream.addTrack(audioTracks[0]);
                }
              }
            } catch (error) {
              console.warn('Audio capture not supported, proceeding with video only:', error);
            }

            // Create MediaRecorder with compression settings
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

            const mediaRecorder = new MediaRecorder(combinedStream, options);
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
                const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
                  type: options.mimeType || 'video/mp4',
                  lastModified: Date.now()
                });
                URL.revokeObjectURL(videoUrl);
                resolve(compressedFile);
                taskResolve();
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
                  taskReject('Video cannot be compressed to the required size');
                }
              }
            };

            mediaRecorder.onerror = (event) => {
              URL.revokeObjectURL(videoUrl);
              reject('Error during video compression: ' + event);
              taskReject('Error during video compression: ' + event);
            };

            // Start recording
            mediaRecorder.start();

            // Play video and draw frames to canvas
            videoElement.currentTime = 0;
            videoElement.play();

            const drawFrame = () => {
              if (videoElement.ended || videoElement.paused) {
                mediaRecorder.stop();
                return;
              }

              ctx.drawImage(videoElement, 0, 0, newWidth, newHeight);
              requestAnimationFrame(drawFrame);
            };

            drawFrame();
          };

          // Start compression process
          compressVideo();
        };

        videoElement.onerror = () => {
          URL.revokeObjectURL(videoUrl);
          reject('Error loading video file');
          taskReject('Error loading video file');
        };

        videoElement.src = videoUrl;
        videoElement.load();
      });
    };

    // Add compression task to queue
    compressionQueue.push(compressionTask);

    // Start processing queue if not already processing
    processCompressionQueue();
  });
}
