import { useEffect, useRef } from 'react';

export const useMediaPause = (isModalOpen: boolean) => {
  const mediaElementsRef = useRef<Array<HTMLVideoElement | HTMLAudioElement>>([]);

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

        // Handle iframes with embedded media
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          const iframeElement = iframe as HTMLIFrameElement;
          const src = iframeElement.src;

          if (!src) return;

          // Try to access iframe content directly for same-origin iframes
          try {
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
          } catch (error) {
            // Cross-origin iframes will throw an error, which is expected
            console.log('Cross-origin iframe detected, using postMessage API');
          }

          // For cross-origin iframes (YouTube, Spotify, etc.), use postMessage API
          if (src.includes('youtube.com') || src.includes('youtu.be')) {
            console.log('Pausing YouTube iframe using iframe API');

            // Use YouTube iframe API to pause the video
            iframeElement.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
              '*'
            );
          } else if (src.includes('vimeo.com')) {
            console.log('Pausing Vimeo iframe');

            // Try to pause Vimeo embeds
            iframeElement.contentWindow?.postMessage(JSON.stringify({ method: 'pause' }), '*');
          } else if (src.includes('platform.twitter.com') || src.includes('x.com')) {
            console.log('Pausing Twitter/X iframe');

            // Try to pause Twitter/X embeds
            iframeElement.contentWindow?.postMessage(JSON.stringify({ type: 'pause' }), '*');
          }
        });

        // Handle Spotify embeds using global registry
        if (typeof window !== 'undefined' && window.spotifyControllers) {
          window.spotifyControllers.forEach((controller, id) => {
            if (controller && typeof controller.pause === 'function') {
              try {
                controller.pause();
              } catch (error) {
                console.error(`Error pausing Spotify embed ${id}:`, error);
              }
            }
          });
        }
      };

      pauseAllMedia();
    } else {
      // Clear references when modal closes
      mediaElementsRef.current = [];
    }

    return () => {
      // Cleanup: clear references when component unmounts
      mediaElementsRef.current = [];
    };
  }, [isModalOpen]);
};
