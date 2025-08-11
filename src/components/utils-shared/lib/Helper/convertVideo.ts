/**
 * Converts an unsupported video type to MP4 format using FFmpeg.wasm
 * @param file - The video file to convert
 * @param onProgress - Optional callback for progress updates (0-100)
 * @param abortSignal - Optional AbortSignal to cancel the conversion
 * @returns Promise<File> - The converted MP4 file
 */
export const convertVideo = async (
  file: File,
  onProgress?: (progress: number) => void,
  abortSignal?: AbortSignal
): Promise<File> => {
  try {
    // Check for cancellation before starting
    if (abortSignal?.aborted) {
      throw new Error('Conversion cancelled');
    }

    // Dynamic import to avoid loading FFmpeg if not needed
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();

    // Load FFmpeg
    await ffmpeg.load();

    // Check for cancellation after loading
    if (abortSignal?.aborted) {
      throw new Error('Conversion cancelled');
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const inputFileName = `input_${timestamp}.${file.name.split('.').pop() || 'mp4'}`;
    const outputFileName = `output_${timestamp}.mp4`;

    // Write input file to FFmpeg
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Check for cancellation after writing input file
    if (abortSignal?.aborted) {
      await ffmpeg.deleteFile(inputFileName);
      throw new Error('Conversion cancelled');
    }

    // Set up progress handler
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        if (typeof progress === 'number' && !isNaN(progress) && progress >= 0 && progress <= 1) {
          const progressPercentage = Math.round(progress * 100);
          onProgress(progressPercentage);
        }
      });
    }

    console.log(`🎬 Starting video conversion from ${file.type} to MP4...`);
    console.log(`📁 Input file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);

    // Build ffmpeg command for conversion to MP4
    const ffmpegArgs = [
      '-threads',
      '0', // Use all available CPU threads
      '-i',
      inputFileName,
      '-c:v',
      'libx264', // Video codec
      '-preset',
      'ultrafast', // Fast encoding
      '-crf',
      '23', // Good quality
      '-c:a',
      'aac', // Audio codec
      '-b:a',
      '128k', // Audio bitrate
      '-movflags',
      '+faststart', // Optimize for web streaming
      '-y', // Overwrite output file
      outputFileName
    ];

    // Execute ffmpeg command with cancellation support
    const execPromise = ffmpeg.exec(ffmpegArgs);

    // Create a cancellation promise
    const cancellationPromise = new Promise<never>((_, reject) => {
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          reject(new Error('Conversion cancelled'));
        });
      }
    });

    // Race between execution and cancellation
    await Promise.race([execPromise, cancellationPromise]);

    // Check for cancellation after execution
    if (abortSignal?.aborted) {
      // Clean up ffmpeg files
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
      throw new Error('Conversion cancelled');
    }

    // Read the converted MP4 file
    const mp4Data = await ffmpeg.readFile(outputFileName);

    // Check if conversion was successful
    if (mp4Data instanceof Uint8Array && mp4Data.length > 0) {
      const mp4Blob = new Blob([mp4Data], { type: 'video/mp4' });
      const convertedFile = new File([mp4Blob], file.name.replace(/\.[^/.]+$/, '.mp4'), {
        type: 'video/mp4',
        lastModified: Date.now()
      });

      console.log(`✅ Video conversion successful!`);
      console.log(`📁 Original size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      console.log(`📁 Converted size: ${(convertedFile.size / (1024 * 1024)).toFixed(2)}MB`);

      // Clean up ffmpeg files
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      return convertedFile;
    } else {
      throw new Error('Failed to read converted MP4 file');
    }
  } catch (error) {
    console.error('❌ Video conversion failed:', error);
    throw new Error(`Video conversion failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
