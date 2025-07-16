import { useState, useEffect } from 'react';
import { FileView } from '@/types/Post';

interface UseInlineUrlsProps {
  text: string;
  files?: string[];
}

interface UseInlineUrlsReturn {
  fileContents: FileView[];
  loading: boolean;
  preview: string;
  videoId: string;
  tweetId: string;
  githubUrl: string;
  spotifyUrl: string;
}

export const useInlineUrls = ({ text, files }: UseInlineUrlsProps): UseInlineUrlsReturn => {
  const [fileContents, setFileContents] = useState<FileView[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState('');
  const [videoId, setVideoId] = useState('');
  const [tweetId, setTweetId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');

  const isValidUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isImageUrl = (url: string): boolean => {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?|#|$)/i) !== null;
  };

  const isVideoUrl = (url: string): boolean => {
    return url.match(/\.(mp4|webm|ogg)(?:\?|#|$)/i) !== null;
  };

  const isAudioUrl = (url: string): boolean => {
    return url.match(/\.(mp3|wav|ogg)(?:\?|#|$)/i) !== null;
  };

  const isPdfUrl = (url: string): boolean => {
    return url.match(/\.(pdf)(?:\?|#|$)/i) !== null;
  };

  const isInternalPubkyUrl = (url: string): boolean => {
    return url.includes('pubky.app/static/files/');
  };

  const getContentTypeFromUrl = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return response.headers.get('content-type');
      }
    } catch (error) {
      console.error('Error fetching content type:', error);
    }
    return null;
  };

  const isValidImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        resolve(false);
      }, 10000); // 10 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = url;
    });
  };

  const isValidVideo = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      video.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        resolve(false);
      }, 10000); // 10 second timeout

      video.src = url;
    });
  };

  const isValidAudio = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.onloadedmetadata = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      audio.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        resolve(false);
      }, 10000); // 10 second timeout

      audio.src = url;
    });
  };

  const createImageFileView = (imageUrl: string, index: number): FileView => {
    const fileName = imageUrl.split('/').pop() || `image-${index}`;
    // Remove query parameters and hash from filename
    const cleanFileName = fileName.split(/[?#]/)[0];
    const fileExtension = cleanFileName.includes('.') ? cleanFileName.split('.').pop()?.toLowerCase() : 'jpg';

    const getContentType = (ext: string): string => {
      switch (ext) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'gif':
          return 'image/gif';
        case 'webp':
          return 'image/webp';
        case 'svg':
          return 'image/svg+xml';
        case 'bmp':
          return 'image/bmp';
        case 'tiff':
          return 'image/tiff';
        default:
          return 'image/jpeg';
      }
    };

    const isInternal = isInternalPubkyUrl(imageUrl);
    const contentType = isInternal ? 'image/jpeg' : getContentType(fileExtension);

    return {
      name: fileName,
      created_at: Date.now(),
      src: 'external',
      content_type: contentType,
      size: 0,
      id: `external-image-${index}`,
      indexed_at: Date.now(),
      owner_id: 'external',
      uri: imageUrl,
      urls: JSON.stringify({ main: imageUrl, feed: imageUrl })
    };
  };

  const createVideoFileView = (videoUrl: string, index: number): FileView => {
    const fileName = videoUrl.split('/').pop() || `video-${index}`;
    // Remove query parameters and hash from filename
    const cleanFileName = fileName.split(/[?#]/)[0];
    const fileExtension = cleanFileName.includes('.') ? cleanFileName.split('.').pop()?.toLowerCase() : 'mp4';

    const getContentType = (ext: string): string => {
      switch (ext) {
        case 'mp4':
          return 'video/mp4';
        case 'webm':
          return 'video/webm';
        case 'ogg':
          return 'video/ogg';
        default:
          return 'video/mp4';
      }
    };

    const isInternal = isInternalPubkyUrl(videoUrl);
    const contentType = isInternal ? 'video/mp4' : getContentType(fileExtension);

    return {
      name: fileName,
      created_at: Date.now(),
      src: 'external',
      content_type: contentType,
      size: 0,
      id: `external-video-${index}`,
      indexed_at: Date.now(),
      owner_id: 'external',
      uri: videoUrl,
      urls: JSON.stringify({ main: videoUrl, feed: videoUrl })
    };
  };

  const createAudioFileView = (audioUrl: string, index: number): FileView => {
    const fileName = audioUrl.split('/').pop() || `audio-${index}`;
    // Remove query parameters and hash from filename
    const cleanFileName = fileName.split(/[?#]/)[0];
    const fileExtension = cleanFileName.includes('.') ? cleanFileName.split('.').pop()?.toLowerCase() : 'mp3';

    const getContentType = (ext: string): string => {
      switch (ext) {
        case 'mp3':
          return 'audio/mpeg';
        case 'wav':
          return 'audio/wav';
        case 'ogg':
          return 'audio/ogg';
        default:
          return 'audio/mpeg';
      }
    };

    const isInternal = isInternalPubkyUrl(audioUrl);
    const contentType = isInternal ? 'audio/mpeg' : getContentType(fileExtension);

    return {
      name: fileName,
      created_at: Date.now(),
      src: 'external',
      content_type: contentType,
      size: 0,
      id: `external-audio-${index}`,
      indexed_at: Date.now(),
      owner_id: 'external',
      uri: audioUrl,
      urls: JSON.stringify({ main: audioUrl, feed: audioUrl })
    };
  };

  const createPdfFileView = (pdfUrl: string, index: number): FileView => {
    const fileName = pdfUrl.split('/').pop() || `pdf-${index}`;
    // Remove query parameters and hash from filename
    const cleanFileName = fileName.split(/[?#]/)[0];
    const fileExtension = cleanFileName.includes('.') ? cleanFileName.split('.').pop()?.toLowerCase() : 'pdf';

    const getContentType = (ext: string): string => {
      switch (ext) {
        case 'pdf':
          return 'application/pdf';
        default:
          return 'application/pdf';
      }
    };

    const isInternal = isInternalPubkyUrl(pdfUrl);
    const contentType = isInternal ? 'application/pdf' : getContentType(fileExtension);

    return {
      name: fileName,
      created_at: Date.now(),
      src: 'external',
      content_type: contentType,
      size: 0,
      id: `external-pdf-${index}`,
      indexed_at: Date.now(),
      owner_id: 'external',
      uri: pdfUrl,
      urls: JSON.stringify({ main: pdfUrl, feed: pdfUrl })
    };
  };

  const cleanText = (text: string) => {
    return text?.replace(/\n{3,}/g, '\n\n');
  };

  const checkForLink = async (text: string) => {
    const protocolRegex = /(https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+)/g;
    const domainRegex = /(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}(?:\/[^\s]*)*/g;

    const allUrls: Array<{ url: string; index: number }> = [];
    const foundImageUrls: string[] = [];
    const foundVideoUrls: string[] = [];
    const foundAudioUrls: string[] = [];
    const foundPdfUrls: string[] = [];
    const internalUrls: string[] = [];

    // Find protocol URLs
    for (const match of text.matchAll(protocolRegex)) {
      let url = match[0].replace(/[^a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/, '');
      allUrls.push({ url, index: match.index! });

      if (isInternalPubkyUrl(url)) {
        internalUrls.push(url);
      } else if (isImageUrl(url)) {
        foundImageUrls.push(url);
      } else if (isVideoUrl(url)) {
        foundVideoUrls.push(url);
      } else if (isAudioUrl(url)) {
        foundAudioUrls.push(url);
      } else if (isPdfUrl(url)) {
        foundPdfUrls.push(url);
      }
    }

    // Find domain-only URLs
    for (const match of text.matchAll(domainRegex)) {
      const domain = match[0];
      const start = match.index!;

      const beforeDomain = text.slice(Math.max(0, start - 8), start);
      if (!beforeDomain.includes('http://') && !beforeDomain.includes('https://')) {
        const fullUrl = `https://${domain}`;
        if (isValidUrl(fullUrl)) {
          allUrls.push({ url: fullUrl, index: start });

          if (isInternalPubkyUrl(fullUrl)) {
            internalUrls.push(fullUrl);
          } else if (isImageUrl(fullUrl)) {
            foundImageUrls.push(fullUrl);
          } else if (isVideoUrl(fullUrl)) {
            foundVideoUrls.push(fullUrl);
          } else if (isAudioUrl(fullUrl)) {
            foundAudioUrls.push(fullUrl);
          } else if (isPdfUrl(fullUrl)) {
            foundPdfUrls.push(fullUrl);
          }
        }
      }
    }

    // Process internal URLs to determine their content type
    if (internalUrls.length > 0) {
      for (const url of internalUrls) {
        const contentType = await getContentTypeFromUrl(url);
        if (contentType) {
          if (contentType.startsWith('image/')) {
            foundImageUrls.push(url);
          } else if (contentType.startsWith('video/')) {
            foundVideoUrls.push(url);
          } else if (contentType.startsWith('audio/')) {
            foundAudioUrls.push(url);
          } else if (contentType === 'application/pdf') {
            foundPdfUrls.push(url);
          }
        }
      }
    }

    // Validate external media URLs before creating FileView objects
    const validImageUrls: string[] = [];
    const validVideoUrls: string[] = [];
    const validAudioUrls: string[] = [];

    if (foundImageUrls.length > 0) {
      const imageValidationPromises = foundImageUrls.map(async (url) => {
        if (isInternalPubkyUrl(url)) {
          // Internal URLs are always considered valid
          return url;
        } else {
          // Validate external image URLs
          const isValid = await isValidImage(url);
          return isValid ? url : null;
        }
      });

      const validationResults = await Promise.all(imageValidationPromises);
      validImageUrls.push(...validationResults.filter((url): url is string => url !== null));
    }

    if (foundVideoUrls.length > 0) {
      const videoValidationPromises = foundVideoUrls.map(async (url) => {
        if (isInternalPubkyUrl(url)) {
          // Internal URLs are always considered valid
          return url;
        } else {
          // Validate external video URLs
          const isValid = await isValidVideo(url);
          return isValid ? url : null;
        }
      });

      const validationResults = await Promise.all(videoValidationPromises);
      validVideoUrls.push(...validationResults.filter((url): url is string => url !== null));
    }

    if (foundAudioUrls.length > 0) {
      const audioValidationPromises = foundAudioUrls.map(async (url) => {
        if (isInternalPubkyUrl(url)) {
          // Internal URLs are always considered valid
          return url;
        } else {
          // Validate external audio URLs
          const isValid = await isValidAudio(url);
          return isValid ? url : null;
        }
      });

      const validationResults = await Promise.all(audioValidationPromises);
      validAudioUrls.push(...validationResults.filter((url): url is string => url !== null));
    }

    // Create FileView objects for found URLs
    if (
      validImageUrls.length > 0 ||
      validVideoUrls.length > 0 ||
      validAudioUrls.length > 0 ||
      foundPdfUrls.length > 0
    ) {
      const imageFileViews = validImageUrls.map((url, index) => createImageFileView(url, index));
      const videoFileViews = validVideoUrls.map((url, index) => createVideoFileView(url, index));
      const audioFileViews = validAudioUrls.map((url, index) => createAudioFileView(url, index));
      const pdfFileViews = foundPdfUrls.map((url, index) => createPdfFileView(url, index));

      setFileContents((prev) => {
        const existingFiles = prev.filter((file) => file.src !== 'external');
        const allExternalFileViews = [...imageFileViews, ...videoFileViews, ...audioFileViews, ...pdfFileViews];
        const maxExternalFiles = Math.max(0, 4 - existingFiles.length);
        const limitedExternalFileViews = allExternalFileViews.slice(0, maxExternalFiles);

        return [...existingFiles, ...limitedExternalFileViews];
      });
    }

    // Process other link types
    if (allUrls.length > 0) {
      const firstUrl = allUrls.sort((a, b) => a.index - b.index)[0];
      const url = firstUrl.url;

      const postRegex = new RegExp(`/post/([^/]+)/([^/]+)`);
      if (postRegex.test(url)) return;

      if (!isImageUrl(url) && !isVideoUrl(url) && !isAudioUrl(url) && !isPdfUrl(url) && !isInternalPubkyUrl(url)) {
        setPreview(url);
      }

      // YouTube video detection
      const getYouTubeID = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      };

      const youtubeId = getYouTubeID(url);
      if (youtubeId) setVideoId(youtubeId);

      // Twitter/X detection
      const twitterRegex = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
      const twitterMatch = url.match(twitterRegex);
      if (twitterMatch) setTweetId(twitterMatch[3]);

      // GitHub detection
      const githubRegex = /https:\/\/github\.com\/[^/]+\/[^/]+(?:\/.*)?/;
      if (githubRegex.test(url)) setGithubUrl(url);

      // Spotify detection
      const spotifyRegex = /https:\/\/open\.spotify\.com\/track\/\w+/;
      if (spotifyRegex.test(url)) setSpotifyUrl(url);
    }
  };

  useEffect(() => {
    const cleanedText = cleanText(text?.toString());
    if (!files?.length) {
      setFileContents([]);
    }
    setLoading(true);
    checkForLink(cleanedText).finally(() => {
      setLoading(false);
    });
  }, [text, files]);

  return {
    fileContents,
    loading,
    preview,
    videoId,
    tweetId,
    githubUrl,
    spotifyUrl
  };
};
