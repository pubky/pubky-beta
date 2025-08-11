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
  onProgress?: (progress: number) => void,
  abortSignal?: AbortSignal
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Check if we need to convert the video format to MP4
    const supportedTypes = ['video/mp4'];
    const needsConversion = !supportedTypes.includes(file.type);

    console.log(`🎬 resizeVideoFile called for: ${file.name} (${file.type})`);
    console.log(`📁 File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`🎯 Max size: ${(maxSizeInBytes / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`🔄 Needs conversion: ${needsConversion}`);
    console.log(`📏 File size <= maxSize: ${file.size <= maxSizeInBytes}`);

    // If the original file is already small enough AND doesn't need conversion, return it as-is
    if (file.size <= maxSizeInBytes && !needsConversion) {
      console.log(`✅ File is small enough and already MP4, returning as-is`);
      resolve(file);
      return;
    }

    if (needsConversion) {
      console.log(`🔄 File needs conversion to MP4, proceeding with FFmpeg processing`);
    }

    const compressionTask = async () => {
      return new Promise<void>(async (taskResolve, taskReject) => {
        let abortHandler: (() => void) | null = null;

        // If file is already small enough but needs conversion, we only convert (no compression)
        // Note: We'll check the actual converted size later to determine if compression is needed
        const needsOnlyConversion = needsConversion && file.size <= maxSizeInBytes;

        // Check for cancellation
        if (abortSignal?.aborted) {
          taskReject(new Error('Compression cancelled'));
          return;
        }

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

          if (needsOnlyConversion) {
            console.log(`🎬 Starting video conversion only from ${file.type} to MP4 (high quality)`);
          } else if (needsConversion) {
            console.log(
              `🎬 Starting video conversion and compression from ${file.type} to MP4 with preset: ${preset}, CRF: ${crf}`
            );
          } else {
            console.log(`🎬 Starting video compression with preset: ${preset}, CRF: ${crf}`);
          }
          console.log(`📁 Input file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);

          // Build ffmpeg command based on operation type
          let ffmpegArgs: string[];

          if (needsOnlyConversion) {
            // For conversion only (no compression), use high quality settings
            ffmpegArgs = [
              '-threads',
              '0',
              '-i',
              inputFileName,
              '-c:v',
              'libx264', // Video codec
              '-preset',
              'ultrafast', // Fast conversion
              '-crf',
              '23', // Good quality (lower CRF = higher quality)
              '-c:a',
              'aac', // Audio codec
              '-b:a',
              '128k', // Audio bitrate
              '-f',
              'mp4', // Force MP4 format
              '-movflags',
              '+faststart', // Optimize for web streaming
              '-y', // Overwrite output file
              outputFileName
            ];
          } else if (needsConversion) {
            // For conversion + compression, ensure proper MP4 conversion
            ffmpegArgs = [
              '-threads',
              '0',
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
              '-f',
              'mp4', // Force MP4 format
              '-movflags',
              '+faststart', // Optimize for web streaming
              '-y', // Overwrite output file
              outputFileName
            ];
          } else {
            // For compression only (already MP4), use compression-optimized settings
            ffmpegArgs = [
              '-threads',
              '0',
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
              '-f',
              'mp4', // Force MP4 format
              '-movflags',
              '+faststart', // Optimize for web streaming
              '-y', // Overwrite output file
              outputFileName
            ];
          }

          // Execute ffmpeg command with progress tracking
          let progressHandler = ({ progress }: { progress: number }) => {
            // Progress is a decimal between 0 and 1, convert to percentage
            if (typeof progress === 'number' && !isNaN(progress) && progress >= 0 && progress <= 1) {
              let progressPercentage: number;

              if (needsOnlyConversion) {
                // Only conversion needed: progress from 0% to 100%
                progressPercentage = Math.round(progress * 100);
              } else if (needsConversion) {
                // Conversion + possible compression: progress from 0% to 50%
                progressPercentage = Math.round(progress * 50);
              } else {
                // Only compression needed: progress from 0% to 100%
                progressPercentage = Math.round(progress * 100);
              }

              if (onProgress) {
                onProgress(progressPercentage);
              }
            }
          };

          ffmpeg.on('progress', progressHandler);

          // Execute ffmpeg command with cancellation support
          const execPromise = ffmpeg.exec(ffmpegArgs);

          // Create a cancellation promise
          const cancellationPromise = new Promise<never>((_, reject) => {
            if (abortSignal) {
              abortHandler = () => {
                reject(new Error('Compression cancelled'));
              };
              abortSignal.addEventListener('abort', abortHandler);
            }
          });

          // Race between execution and cancellation
          await Promise.race([execPromise, cancellationPromise]);

          // Clean up abort listener
          if (abortSignal && abortHandler) {
            abortSignal.removeEventListener('abort', abortHandler);
          }

          // Check for cancellation after execution
          if (abortSignal?.aborted) {
            // Try to clean up ffmpeg files, but don't fail if cleanup fails
            try {
              await ffmpeg.deleteFile(inputFileName);
              await ffmpeg.deleteFile(outputFileName);
            } catch (cleanupError) {
              console.warn('⚠️ Warning: Failed to clean up FFmpeg files during cancellation:', cleanupError);
            }
            taskReject(new Error('Compression cancelled'));
            return;
          }

          // Clean up progress listener
          ffmpeg.off('progress', progressHandler);

          // Read the compressed file
          const compressedData = await ffmpeg.readFile(outputFileName);

          // Check if the compressed file is within size limit
          try {
            if (compressedData instanceof Uint8Array && compressedData.length > 0) {
              // Always create MP4 blob regardless of input format
              const compressedBlob = new Blob([compressedData], { type: 'video/mp4' });

              // Always create MP4 file with .mp4 extension
              const finalFileName = file.name.replace(/\.[^/.]+$/, '') + '.mp4';
              const compressedFile = new File([compressedBlob], finalFileName, {
                type: 'video/mp4',
                lastModified: Date.now()
              });

              // Verify that the file is actually MP4 by checking the blob type
              console.log(`🔍 Created file with type: ${compressedFile.type}`);
              console.log(`🔍 Blob type: ${compressedBlob.type}`);
              console.log(`🔍 File name: ${compressedFile.name}`);
              console.log(`🔍 Original name: ${file.name}`);

              // Check if the converted file needs compression
              if (compressedFile.size <= maxSizeInBytes) {
                // File is within size limit after conversion
                if (needsOnlyConversion) {
                  console.log(`✅ Video conversion only successful!`);
                  console.log(`🔄 Converted from ${file.type} to MP4 (no compression needed)`);
                  console.log(`📁 Original size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                  console.log(`📁 Final size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`);
                } else if (needsConversion) {
                  console.log(`✅ Video conversion and compression successful!`);
                  console.log(`🔄 Converted from ${file.type} to MP4`);
                  console.log(`📁 Original size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                  console.log(`📁 Final size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`);
                } else {
                  console.log(`✅ Video compression successful!`);
                  console.log(`📁 Original size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                  console.log(`📁 Final size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB`);
                }

                // Try to clean up ffmpeg files, but don't fail if cleanup fails
                try {
                  await ffmpeg.deleteFile(inputFileName);
                  await ffmpeg.deleteFile(outputFileName);
                } catch (cleanupError) {
                  console.warn('⚠️ Warning: Failed to clean up FFmpeg files:', cleanupError);
                  // Don't fail the operation if cleanup fails
                }

                // Set progress to 100% for successful completion
                if (onProgress) {
                  onProgress(100);
                }

                resolve(compressedFile);
                taskResolve();
                return;
              } else {
                // File is too large after conversion, needs compression
                console.log(
                  `⚠️ Converted file is too large (${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB), applying compression...`
                );

                // Clean up the first conversion attempt
                try {
                  await ffmpeg.deleteFile(inputFileName);
                  await ffmpeg.deleteFile(outputFileName);
                } catch (cleanupError) {
                  console.warn('⚠️ Warning: Failed to clean up FFmpeg files:', cleanupError);
                }

                // Now compress the converted file with higher compression settings
                const compressedInputFileName = `compressed_input_${Date.now()}.mp4`;
                const compressedOutputFileName = `compressed_output_${Date.now()}.mp4`;

                // Write the converted file back to FFmpeg for compression
                await ffmpeg.writeFile(compressedInputFileName, compressedData);

                // Set up progress handler for compression phase
                let compressionProgressHandler = ({ progress }: { progress: number }) => {
                  if (typeof progress === 'number' && !isNaN(progress) && progress >= 0 && progress <= 1) {
                    // Compression phase: progress from 50% to 100%
                    const compressionProgressPercentage = 50 + Math.round(progress * 50);
                    if (onProgress) {
                      onProgress(compressionProgressPercentage);
                    }
                  }
                };

                ffmpeg.on('progress', compressionProgressHandler);

                // Use higher compression settings
                const compressionArgs = [
                  '-threads',
                  '0',
                  '-i',
                  compressedInputFileName,
                  '-c:v',
                  'libx264',
                  '-preset',
                  'fast',
                  '-crf',
                  '28', // Higher compression
                  '-c:a',
                  'aac',
                  '-b:a',
                  '96k', // Lower audio bitrate
                  '-f',
                  'mp4',
                  '-movflags',
                  '+faststart',
                  '-y',
                  compressedOutputFileName
                ];

                console.log(`🎬 Applying compression with CRF 28...`);
                await ffmpeg.exec(compressionArgs);

                // Clean up compression progress listener
                ffmpeg.off('progress', compressionProgressHandler);

                // Read the compressed file
                const finalCompressedData = await ffmpeg.readFile(compressedOutputFileName);

                if (finalCompressedData instanceof Uint8Array && finalCompressedData.length > 0) {
                  const finalCompressedBlob = new Blob([finalCompressedData], { type: 'video/mp4' });
                  const finalCompressedFile = new File([finalCompressedBlob], file.name.replace(/\.[^/.]+$/, '.mp4'), {
                    type: 'video/mp4',
                    lastModified: Date.now()
                  });

                  console.log(`✅ Final compression successful!`);
                  console.log(`📁 Final size: ${(finalCompressedFile.size / (1024 * 1024)).toFixed(2)}MB`);

                  // Clean up all files
                  try {
                    await ffmpeg.deleteFile(compressedInputFileName);
                    await ffmpeg.deleteFile(compressedOutputFileName);
                  } catch (cleanupError) {
                    console.warn('⚠️ Warning: Failed to clean up FFmpeg files:', cleanupError);
                  }

                  // Set progress to 100% for successful completion
                  if (onProgress) {
                    onProgress(100);
                  }

                  resolve(finalCompressedFile);
                  taskResolve();
                  return;
                } else {
                  throw new Error('Failed to read final compressed file');
                }
              }
            }
          } catch (ffmpegError) {
            console.error('❌ FFmpeg.wasm failed:', ffmpegError);

            // Clean up abort listener
            if (abortSignal && abortHandler) {
              abortSignal.removeEventListener('abort', abortHandler);
            }

            // Check if it was cancelled
            if (ffmpegError instanceof Error && ffmpegError.message === 'Compression cancelled') {
              // Reset FFmpeg instance for next use
              ffmpegInstance = null;
              reject('Compression cancelled');
              taskReject('Compression cancelled');
              return;
            }

            let errorMsg: string;
            if (needsOnlyConversion) {
              errorMsg = `Video conversion failed: ${ffmpegError instanceof Error ? ffmpegError.message : String(ffmpegError)}`;
            } else if (needsConversion) {
              errorMsg = `Video conversion and compression failed: ${ffmpegError instanceof Error ? ffmpegError.message : String(ffmpegError)}`;
            } else {
              errorMsg = `Video compression failed: ${ffmpegError instanceof Error ? ffmpegError.message : String(ffmpegError)}`;
            }
            reject(errorMsg);
            taskReject(errorMsg);
          }
        } catch (error) {
          console.error('❌ Error during video compression:', error);
          let errorMsg: string;
          if (needsOnlyConversion) {
            errorMsg = `Error during video conversion: ${error instanceof Error ? error.message : String(error)}`;
          } else if (needsConversion) {
            errorMsg = `Error during video conversion and compression: ${error instanceof Error ? error.message : String(error)}`;
          } else {
            errorMsg = `Error during video compression: ${error instanceof Error ? error.message : String(error)}`;
          }
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
