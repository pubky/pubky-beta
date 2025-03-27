import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export async function convertVideoToMp4(file: File): Promise<File> {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Write the video file to FFmpeg's virtual filesystem
  await ffmpeg.writeFile(file.name, await fetchFile(file));

  // Run FFmpeg command to convert to MP4
  await ffmpeg.exec(['-i', file.name, '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4']);

  // Read the converted file
  const data = await ffmpeg.readFile('output.mp4');

  // Create a new File object with the converted data
  const convertedFile = new File([data], file.name.replace(/\.[^/.]+$/, '.mp4'), {
    type: 'video/mp4',
    lastModified: file.lastModified
  });

  // Clean up
  await ffmpeg.deleteFile(file.name);
  await ffmpeg.deleteFile('output.mp4');

  return convertedFile;
}
