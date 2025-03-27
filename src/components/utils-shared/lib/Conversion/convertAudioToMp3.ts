import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const convertAudioToMp3 = async (file: File): Promise<File> => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Write the input file to FFmpeg's virtual filesystem
  await ffmpeg.writeFile('input', await fetchFile(file));

  // Run FFmpeg command to convert to MP3
  await ffmpeg.exec(['-i', 'input', '-c:a', 'libmp3lame', '-q:a', '2', 'output.mp3']);

  // Read the converted file
  const data = await ffmpeg.readFile('output.mp3');

  // Create a new File object with the converted data
  const newFileName = file.name.replace(/\.[^/.]+$/, '.mp3');
  const convertedFile = new File([data], newFileName, {
    type: 'audio/mpeg'
  });

  // Clean up
  await ffmpeg.deleteFile('input');
  await ffmpeg.deleteFile('output.mp3');

  return convertedFile;
};
