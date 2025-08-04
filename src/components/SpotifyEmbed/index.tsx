'use client';

import { useEffect, useRef, useState } from 'react';

interface SpotifyEmbedProps {
  link: string;
  width?: string;
  height?: string;
}

// Global registry for Spotify controllers
declare global {
  interface Window {
    spotifyControllers: Map<string, any>;
    spotifyIframeAPI: any;
  }
}

// Initialize global registry if it doesn't exist
if (typeof window !== 'undefined' && !window.spotifyControllers) {
  window.spotifyControllers = new Map();
}

export default function SpotifyEmbed({ link, width = '100%', height = '160' }: SpotifyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const embedId = useRef(`spotify-embed-${Math.random().toString(36).substr(2, 9)}`);
  const isComponentMounted = useRef(true);
  const controllerCreated = useRef(false);

  // Convert Spotify URL to URI format for API
  const convertSpotifyUrlToUri = (url: string): string => {
    // Handle different Spotify URL formats
    const trackMatch = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    const albumMatch = url.match(/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/);
    const playlistMatch = url.match(/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    const episodeMatch = url.match(/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/);
    const showMatch = url.match(/open\.spotify\.com\/show\/([a-zA-Z0-9]+)/);

    if (trackMatch) {
      return `spotify:track:${trackMatch[1]}`;
    } else if (albumMatch) {
      return `spotify:album:${albumMatch[1]}`;
    } else if (playlistMatch) {
      return `spotify:playlist:${playlistMatch[1]}`;
    } else if (episodeMatch) {
      return `spotify:episode:${episodeMatch[1]}`;
    } else if (showMatch) {
      return `spotify:show:${showMatch[1]}`;
    }

    // If no match found, return the original URL
    return url;
  };

  // Create a stable ID based on the Spotify URL to prevent duplicates
  const spotifyUri = convertSpotifyUrlToUri(link);

  // Convert Spotify URL to embed URL format for iframe
  const convertSpotifyUrlToEmbedUrl = (url: string): string => {
    // Handle different Spotify URL formats
    const trackMatch = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    const albumMatch = url.match(/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/);
    const playlistMatch = url.match(/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    const episodeMatch = url.match(/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/);
    const showMatch = url.match(/open\.spotify\.com\/show\/([a-zA-Z0-9]+)/);

    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
    } else if (albumMatch) {
      return `https://open.spotify.com/embed/album/${albumMatch[1]}`;
    } else if (playlistMatch) {
      return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`;
    } else if (episodeMatch) {
      return `https://open.spotify.com/embed/episode/${episodeMatch[1]}`;
    } else if (showMatch) {
      return `https://open.spotify.com/embed/show/${showMatch[1]}`;
    }

    // If no match found, return the original URL
    return url;
  };

  const embedUrl = convertSpotifyUrlToEmbedUrl(link);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const loadSpotifyScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) {
        // If script exists, check if API is available
        if (window.spotifyIframeAPI && isComponentMounted.current) {
          createController();
        } else if (isComponentMounted.current) {
          // Wait for API to be ready
          const checkAPI = setInterval(() => {
            if (window.spotifyIframeAPI && isComponentMounted.current) {
              clearInterval(checkAPI);
              createController();
            } else if (!isComponentMounted.current) {
              clearInterval(checkAPI);
            }
          }, 100);

          setTimeout(() => {
            clearInterval(checkAPI);
          }, 10000);
        }
        return;
      }

      // Create and load the script
      script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
    };

    const createController = () => {
      if (!containerRef.current || !window.spotifyIframeAPI || !isComponentMounted.current) return;

      // Prevent double initialization for the same component instance
      if (controllerCreated.current) {
        console.log('Controller already created for this component instance:', embedId.current);
        return;
      }

      const options = {
        uri: spotifyUri,
        width: width,
        height: height
      };

      const callback = (spotifyEmbedController: any) => {
        if (isComponentMounted.current) {
          setIsLoaded(true);
          controllerCreated.current = true;

          // Register the controller globally for use in useMediaPause
          window.spotifyControllers.set(embedId.current, spotifyEmbedController);
        }
      };

      try {
        window.spotifyIframeAPI.createController(containerRef.current, options, callback);
      } catch (error) {
        console.error('Error creating Spotify embed controller:', error);
      }
    };

    // Set up the global callback if not already set
    if (!(window as any).onSpotifyIframeApiReady) {
      (window as any).onSpotifyIframeApiReady = (SpotifyIframeApi: any) => {
        window.spotifyIframeAPI = SpotifyIframeApi;
        if (isComponentMounted.current) {
          createController();
        }
      };
    } else if (isComponentMounted.current) {
      // If callback already exists, try to create controller
      createController();
    }

    // Start the process
    loadSpotifyScript();

    return () => {
      isComponentMounted.current = false;
      controllerCreated.current = false;

      // Remove from global registry
      try {
        window.spotifyControllers.delete(embedId.current);
      } catch (error) {
        // Ignore errors during cleanup
      }
    };
  }, [spotifyUri, width, height]);

  return (
    <div
      ref={containerRef}
      id={embedId.current}
      className="spotify-embed-container"
      style={{
        width,
        height,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        allow="encrypted-media"
        style={{
          borderRadius: '12px',
          border: 'none'
        }}
        onLoad={() => {
          if (isComponentMounted.current) {
            setIsLoaded(true);
          }
        }}
      />
    </div>
  );
}
