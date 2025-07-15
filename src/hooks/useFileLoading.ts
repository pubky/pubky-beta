import { useState, useEffect } from 'react';
import { FileView } from '@/types/Post';
import { getFile } from '@/services/fileService';

interface UseFileLoadingProps {
  files?: string[];
  externalFileContents: FileView[];
}

interface UseFileLoadingReturn {
  fileContents: FileView[];
  loading: boolean;
}

export const useFileLoading = ({ files, externalFileContents }: UseFileLoadingProps): UseFileLoadingReturn => {
  const [fileContents, setFileContents] = useState<FileView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const retryInterval = 5000; // 5 seconds
    let retryTimeouts: NodeJS.Timeout[] = [];

    const fetchFile = async (fileUri: string, retryCount = 0): Promise<FileView | null> => {
      try {
        const fetchedFile = await getFile(fileUri);
        return fetchedFile;
      } catch (error) {
        // Return skeleton and schedule retry
        if (retryCount < 5) {
          // Limit retries to prevent infinite loops
          const timeoutId = setTimeout(async () => {
            const result = await fetchFile(fileUri, retryCount + 1);
            if (result) {
              // Update the specific file in fileContents
              setFileContents((prev) =>
                prev.map((f) =>
                  f.urls === JSON.stringify({ main: 'skeleton' }) ? { ...result, urls: result.urls } : f
                )
              );
            }
          }, retryInterval);
          retryTimeouts.push(timeoutId);
        }
        return {
          content_type: 'skeleton',
          urls: JSON.stringify({ main: 'skeleton' }),
          name: 'Loading...',
          created_at: Date.now(),
          src: 'skeleton',
          uri: fileUri,
          id: `skeleton-${fileUri}`,
          indexed_at: Date.now(),
          owner_id: `skeleton-${fileUri}`,
          size: 0
        };
      }
    };

    const fetchFiles = async () => {
      if (files?.length > 0) {
        setLoading(true);
        const fileUris = Object.values(files).map((file) => file);
        const fetchedFiles = await Promise.all(fileUris.map((fileUri) => fetchFile(fileUri)));

        setFileContents((prev) => {
          // Preserve external files (images, videos, audio, and PDFs) when adding fetched files
          const externalFiles = prev.filter((file) => file.src === 'external');
          const newFiles = fetchedFiles
            .filter((file): file is FileView => file !== null)
            .map((file) => ({
              ...file,
              urls: file.urls
            }));

          // Limit total files to 4, giving priority to loaded files
          const totalFiles = newFiles.length + externalFiles.length;
          if (totalFiles <= 4) {
            return [...newFiles, ...externalFiles];
          } else {
            // If we exceed 4 files, keep all loaded files and limit external files
            const maxExternalFiles = Math.max(0, 4 - newFiles.length);
            const limitedExternalFiles = externalFiles.slice(0, maxExternalFiles);
            return [...newFiles, ...limitedExternalFiles];
          }
        });
        setLoading(false);
      }
    };

    fetchFiles();

    // Cleanup timeouts on unmount
    return () => {
      retryTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [files]);

  // Update fileContents when externalFileContents changes
  useEffect(() => {
    setFileContents((prev) => {
      const existingFiles = prev.filter((file) => file.src !== 'external');
      return [...existingFiles, ...externalFileContents];
    });
  }, [externalFileContents]);

  return {
    fileContents,
    loading
  };
};
