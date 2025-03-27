import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const convertImageToPng = async (file: File): Promise<File> => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Write the input file to FFmpeg's virtual filesystem
  await ffmpeg.writeFile('input', await fetchFile(file));

  // Run FFmpeg command to convert to PNG
  await ffmpeg.exec(['-i', 'input', '-vf', 'format=rgb24', 'output.png']);

  // Read the converted file
  const data = await ffmpeg.readFile('output.png');

  // Create a new File object with the converted data
  const newFileName = file.name.replace(/\.[^/.]+$/, '.png');
  const convertedFile = new File([data], newFileName, {
    type: 'image/png'
  });

  // Clean up
  await ffmpeg.deleteFile('input');
  await ffmpeg.deleteFile('output.png');

  return convertedFile;
};
