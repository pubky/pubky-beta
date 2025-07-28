import { useEffect, useRef } from 'react';

export const useMediaPause = (isModalOpen: boolean) => {
  const mediaElementsRef = useRef<Array<HTMLVideoElement | HTMLAudioElement | HTMLIFrameElement>>([]);

  useEffect(() => {
    if (isModalOpen) {
      // Pause all media elements when modal opens
      const pauseAllMedia = () => {
        // Pause all video elements
        const videos = document.querySelectorAll('video');
        videos.forEach((video) => {
          if (!video.paused) {
            video.pause();
            mediaElementsRef.current.push(video);
          }
        });

        // Pause all audio elements
        const audios = document.querySelectorAll('audio');
        audios.forEach((audio) => {
          if (!audio.paused) {
            audio.pause();
            mediaElementsRef.current.push(audio);
          }
        });

        // Pause YouTube iframes by removing src and setting it back
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement;
          const src = iframeElement.src;
          if (src && (src.includes('youtube.com') || src.includes('youtu.be'))) {
            iframeElement.src = '';
            iframeElement.src = src;
            mediaElementsRef.current.push(iframeElement);
          }
        });

        // Pause Spotify embeds
        const spotifyEmbeds = document.querySelectorAll('iframe[src*="spotify.com"]');
        spotifyEmbeds.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement;
          const src = iframeElement.src;
          if (src) {
            iframeElement.src = '';
            iframeElement.src = src;
            mediaElementsRef.current.push(iframeElement);
          }
        });

        // Pause Twitter/X embeds by reloading them
        const tweetEmbeds = document.querySelectorAll('iframe[src*="platform.twitter.com"], iframe[src*="x.com"]');
        tweetEmbeds.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement;
          const src = iframeElement.src;
          if (src) {
            iframeElement.src = '';
            iframeElement.src = src;
            mediaElementsRef.current.push(iframeElement);
          }
        });

        // Pause any other iframe that might contain media
        const allIframes = document.querySelectorAll('iframe');
        allIframes.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement;
          const src = iframeElement.src;
          // Skip if we already handled this iframe above
          if (src && 
              !src.includes('youtube.com') && 
              !src.includes('youtu.be') && 
              !src.includes('spotify.com') && 
              !src.includes('platform.twitter.com') && 
              !src.includes('x.com')) {
            // For other iframes, try to pause by reloading
            iframeElement.src = '';
            iframeElement.src = src;
            mediaElementsRef.current.push(iframeElement);
          }
        });

        // Also try to pause any media elements inside iframes (if accessible)
        try {
          allIframes.forEach((iframe) => {
            const iframeElement = iframe as HTMLIFrameElement;
            if (iframeElement.contentDocument) {
              const iframeVideos = iframeElement.contentDocument.querySelectorAll('video');
              iframeVideos.forEach((video) => {
                if (!video.paused) {
                  video.pause();
                }
              });

              const iframeAudios = iframeElement.contentDocument.querySelectorAll('audio');
              iframeAudios.forEach((audio) => {
                if (!audio.paused) {
                  audio.pause();
                }
              });
            }
          });
        } catch (error) {
          // Cross-origin iframes will throw an error, which is expected
          console.log('Some iframes are cross-origin and cannot be accessed');
        }
      };

      pauseAllMedia();
    } else {
      // Clear the reference when modal closes
      mediaElementsRef.current = [];
    }

    return () => {
      // Cleanup: clear references when component unmounts
      mediaElementsRef.current = [];
    };
  }, [isModalOpen]);
}; 