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
    console.log('Loading ffmpeg.wasm...');
    ffmpegInstance = new FFmpeg();

    // Load ffmpeg core locally - no external URLs needed
    console.log('Loading FFmpeg locally...');
    await ffmpegInstance.load();
    console.log('FFmpeg loaded successfully');

    return ffmpegInstance;
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    ffmpegInstance = null;
    throw new Error(`Failed to load FFmpeg: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    isFFmpegLoading = false;
  }
}

export async function resizeVideoFile(file: File, maxSizeInBytes: number = 20 * 1024 * 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    // If the original file is already small enough, return it as-is
    if (file.size <= maxSizeInBytes) {
      resolve(file);
      return;
    }

    const compressionTask = async () => {
      return new Promise<void>(async (taskResolve, taskReject) => {
        try {
          console.log('Starting video compression...');

          // Try ffmpeg.wasm first
          try {
            const ffmpeg = await getFFmpegInstance();

            // Generate unique filenames for input and output
            const timestamp = Date.now();
            const inputFileName = `input_${timestamp}.${file.name.split('.').pop() || 'mp4'}`;
            const outputFileName = `output_${timestamp}.mp4`;

            console.log('Writing input file to ffmpeg...');
            // Write input file to ffmpeg
            await ffmpeg.writeFile(inputFileName, await fetchFile(file));

            console.log('Starting first compression attempt...');
            // Build ffmpeg command for compression
            const ffmpegArgs = [
              '-i',
              inputFileName,
              '-c:v',
              'libx264', // Video codec
              '-preset',
              'medium', // Compression preset (balance between speed and quality)
              '-crf',
              '23', // Constant Rate Factor (18-28 is good quality)
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
            ffmpeg.on('progress', ({ progress }) => {
              console.log(`FFmpeg progress: ${Math.round(progress * 100)}%`);
            });

            // Execute ffmpeg command
            console.log('Executing FFmpeg command...');
            await ffmpeg.exec(ffmpegArgs);

            // Read the compressed file
            const compressedData = await ffmpeg.readFile(outputFileName);
            console.log(
              'Compressed data type:',
              typeof compressedData,
              'instanceof Uint8Array:',
              compressedData instanceof Uint8Array
            );
            console.log(
              'Compressed data length:',
              compressedData instanceof Uint8Array ? compressedData.length : 'N/A'
            );
            console.log('Max size limit:', maxSizeInBytes);

            // Check if the compressed file is within size limit
            if (compressedData instanceof Uint8Array && compressedData.length <= maxSizeInBytes) {
              console.log('First compression successful, file size:', compressedData.length);
              console.log('Creating Blob from compressed data...');
              const compressedBlob = new Blob([compressedData as any], { type: 'video/mp4' });
              console.log('Creating File from Blob...');
              const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
                type: 'video/mp4',
                lastModified: Date.now()
              });
              console.log('File created, size:', compressedFile.size);

              // Clean up ffmpeg files
              await ffmpeg.deleteFile(inputFileName);
              await ffmpeg.deleteFile(outputFileName);

              console.log('Video compression completed successfully with ffmpeg.wasm');
              resolve(compressedFile);
              taskResolve();
              return;
            } else {
              console.log('First compression too large, trying more aggressive compression...');
              // If still too large, try more aggressive compression
              const moreAggressiveArgs = [
                '-i',
                inputFileName,
                '-c:v',
                'libx264',
                '-preset',
                'slow', // Slower preset for better compression
                '-crf',
                '28', // Higher CRF for more compression
                '-c:a',
                'aac',
                '-b:a',
                '96k', // Lower audio bitrate
                '-movflags',
                '+faststart',
                '-y',
                outputFileName
              ];

              await ffmpeg.exec(moreAggressiveArgs);

              const compressedData = await ffmpeg.readFile(outputFileName);

              if (compressedData instanceof Uint8Array && compressedData.length <= maxSizeInBytes) {
                console.log('Second compression successful, file size:', compressedData.length);
                const compressedBlob = new Blob([compressedData as any], { type: 'video/mp4' });
                const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
                  type: 'video/mp4',
                  lastModified: Date.now()
                });

                // Clean up ffmpeg files
                await ffmpeg.deleteFile(inputFileName);
                await ffmpeg.deleteFile(outputFileName);

                console.log('Video compression completed successfully with ffmpeg.wasm');
                resolve(compressedFile);
                taskResolve();
                return;
              } else {
                console.log('Second compression too large, trying final compression...');
                // If still too large, try reducing dimensions further

                const finalArgs = [
                  '-i',
                  inputFileName,
                  '-c:v',
                  'libx264',
                  '-preset',
                  'slow',
                  '-crf',
                  '30', // Even higher CRF
                  '-c:a',
                  'aac',
                  '-b:a',
                  '64k', // Even lower audio bitrate
                  '-movflags',
                  '+faststart',
                  '-y',
                  outputFileName
                ];

                await ffmpeg.exec(finalArgs);

                const finalCompressedData = await ffmpeg.readFile(outputFileName);

                if (finalCompressedData instanceof Uint8Array && finalCompressedData.length <= maxSizeInBytes) {
                  console.log('Final compression successful, file size:', finalCompressedData.length);
                  const compressedBlob = new Blob([finalCompressedData as any], { type: 'video/mp4' });
                  const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.mp4', {
                    type: 'video/mp4',
                    lastModified: Date.now()
                  });

                  // Clean up ffmpeg files
                  await ffmpeg.deleteFile(inputFileName);
                  await ffmpeg.deleteFile(outputFileName);

                  console.log('Video compression completed successfully with ffmpeg.wasm');
                  resolve(compressedFile);
                  taskResolve();
                  return;
                } else {
                  // Clean up ffmpeg files
                  await ffmpeg.deleteFile(inputFileName);
                  await ffmpeg.deleteFile(outputFileName);

                  throw new Error('Video cannot be compressed to the required size with ffmpeg.wasm');
                }
              }
            }
          } catch (ffmpegError) {
            console.error('FFmpeg.wasm failed:', ffmpegError);
            const errorMsg = `Video compression failed: ${ffmpegError instanceof Error ? ffmpegError.message : String(ffmpegError)}`;
            reject(errorMsg);
            taskReject(errorMsg);
          }
        } catch (error) {
          console.error('Error during video compression:', error);
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
