// Helper function to resize and compress a video file to fit within a maximum file size while maintaining aspect ratio
// This function uses ffmpeg.wasm for cross-browser compatibility

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Queue system to handle multiple video compressions sequentially
let compressionQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;
let ffmpegInstance: FFmpeg | null = null;
let isFFmpegLoading = false;

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

// Initialize ffmpeg instance with timeout and better error handling
async function getFFmpegInstance(): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  if (isFFmpegLoading) {
    // Wait for the loading to complete
    while (isFFmpegLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (ffmpegInstance) {
      return ffmpegInstance;
    }
  }

  isFFmpegLoading = true;

  try {
    ffmpegInstance = new FFmpeg();

    // Load ffmpeg core locally - no external URLs needed

    await ffmpegInstance.load();

    return ffmpegInstance;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    ffmpegInstance = null;
    throw new Error(`Failed to load FFmpeg: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    isFFmpegLoading = false;
  }
}

export async function resizeVideoFile(
  file: File,
  maxSizeInBytes: number = 20 * 1024 * 1024,
  onProgress?: (progress: number) => void
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If the original file is already small enough, return it as-is
    if (file.size <= maxSizeInBytes) {
      resolve(file);
      return;
    }

    const compressionTask = async () => {
      return new Promise<void>(async (taskResolve, taskReject) => {
        try {
          // Try ffmpeg.wasm first
          try {
            const ffmpeg = await getFFmpegInstance();

            // Generate unique filenames for input and output
            const timestamp = Date.now();
            const inputFileName = `input_${timestamp}.${file.name.split('.').pop() || 'mp4'}`;
            const outputFileName = `output_${timestamp}.mp4`;

            // Write input file to ffmpeg
            await ffmpeg.writeFile(inputFileName, await fetchFile(file));

            // Determine optimal preset based on input file size
            let preset: string;
            let crf: number;
            
            if (file.size < 30 * 1024 * 1024) {
              // Small files (< 30MB)
              preset = 'ultrafast';
              crf = 25;
            } else if (file.size < 60 * 1024 * 1024) {
              // Medium files (30-60MB
              preset = 'veryfast';
              crf = 28;
            } else if (file.size < 80 * 1024 * 1024) {
              // Medium files (60-80MB)
              preset = 'veryfast';
              crf = 30;
            } else {
              // Large files (80-100MB)
              preset = 'fast';
              crf = 32;
            }

            console.log(`🎬 Starting video compression with preset: ${preset}, CRF: ${crf}`);
            console.log(`📁 Input file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);

            // Build ffmpeg command for compression
            const ffmpegArgs = [
              '-threads',
              '0', // Use all available CPU threads for input
              '-i',
              inputFileName,
              '-c:v',
              'libx264', // Video codec
              '-preset',
              preset,
              '-crf',
              crf.toString(),
              '-c:a',
              'aac', // Audio codec
              '-b:a',
              '128k', // Audio bitrate
              '-movflags',
              '+faststart', // Optimize for web streaming
              '-y', // Overwrite output file
              outputFileName
            ];

            // Execute ffmpeg command with progress tracking
            const progressHandler = ({ progress }: { progress: number }) => {
              // Progress is a decimal between 0 and 1, convert to percentage
              if (typeof progress === 'number' && !isNaN(progress) && progress >= 0 && progress <= 1) {
                const progressPercentage = Math.round(progress * 100);
                
                if (onProgress) {
                  onProgress(progressPercentage);
                }
              }
            };
            
            ffmpeg.on('progress', progressHandler);

            // Execute ffmpeg command
            await ffmpeg.exec(ffmpegArgs);
            
            // Clean up progress listener
            ffmpeg.off('progress', progressHandler);

            // Read the compressed file
            const compressedData = await ffmpeg.readFile(outputFileName);

                          // Check if the compressed file is within size limit
              if (compressedData instanceof Uint8Array && compressedData.length <= maxSizeInBytes) {
                const compressedBlob = new Blob([compressedData as any], { type: 'video/mp4' });

                const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
                  type: 'video/mp4',
                  lastModified: Date.now()
                });

                console.log(`✅ Video compression successful!`);
                console.log(`📁 Original size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                console.log(`📁 Compressed size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`);
                console.log(`📊 Compression ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);

                // Clean up ffmpeg files
                await ffmpeg.deleteFile(inputFileName);
                await ffmpeg.deleteFile(outputFileName);

                resolve(compressedFile);
                taskResolve();
                return;
              } else {
                // Clean up ffmpeg files
                await ffmpeg.deleteFile(inputFileName);
                await ffmpeg.deleteFile(outputFileName);

                const compressedSizeMB = (compressedData instanceof Uint8Array ? compressedData.length : 0) / (1024 * 1024);
                const targetSizeMB = maxSizeInBytes / (1024 * 1024);
                const originalSizeMB = file.size / (1024 * 1024);
                
                console.log(`❌ Video compression failed!`);
                console.log(`📁 Original size: ${originalSizeMB.toFixed(2)}MB`);
                console.log(`📁 Compressed size: ${compressedSizeMB.toFixed(2)}MB`);
                console.log(`🎯 Target size: ${targetSizeMB.toFixed(2)}MB`);
                console.log(`📊 Compression ratio: ${((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1)}%`);

                const errorMsg = `Video compressed to ${compressedSizeMB.toFixed(1)}MB. The maximum allowed size for videos is 20 MB.`;
                reject(errorMsg);
                taskReject(errorMsg);
              }
          } catch (ffmpegError) {
            console.error('❌ FFmpeg.wasm failed:', ffmpegError);
            const errorMsg = `Video compression failed: ${ffmpegError instanceof Error ? ffmpegError.message : String(ffmpegError)}`;
            reject(errorMsg);
            taskReject(errorMsg);
          }
        } catch (error) {
          console.error('❌ Error during video compression:', error);
          const errorMsg = `Error during video compression: ${error instanceof Error ? error.message : String(error)}`;
          reject(errorMsg);
          taskReject(errorMsg);
        }
      });
    };

    // Add compression task to queue
    compressionQueue.push(compressionTask);

    // Start processing queue if not already processing
    processCompressionQueue();
  });
}
