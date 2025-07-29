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
  }
}

// Initialize global registry if it doesn't exist
if (typeof window !== 'undefined' && !window.spotifyControllers) {
  window.spotifyControllers = new Map();
}

export default function SpotifyEmbed({ link, width = '100%', height = '160' }: SpotifyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const embedId = useRef(`spotify-embed-${Math.random().toString(36).substr(2, 9)}`);

  // Convert Spotify URL to URI format
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

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const loadSpotifyScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) {
        setIsScriptLoaded(true);
        return;
      }

      // Create and load the script
      script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Spotify iFrame API');
      };
      document.body.appendChild(script);
    };

    const initializeSpotifyEmbed = () => {
      if (!containerRef.current || !isScriptLoaded) return;

      // Set up the global callback if not already set
      if (!(window as any).onSpotifyIframeApiReady) {
        (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
          const element = containerRef.current;
          if (!element) return;

          const spotifyUri = convertSpotifyUrlToUri(link);

          const options = {
            uri: spotifyUri,
            width: width,
            height: height
          };

          const callback = (EmbedController: any) => {
            setIsLoaded(true);
            // Store the controller locally on the element
            (element as any).spotifyController = EmbedController;
            // Register the controller globally
            window.spotifyControllers.set(embedId.current, EmbedController);
          };

          try {
            IFrameAPI.createController(element, options, callback);
          } catch (error) {
            console.error('Error creating Spotify embed controller:', error);
          }
        };
      } else {
        // If callback already exists, trigger it manually
        const IFrameAPI = (window as any).SpotifyIframeAPI;
        if (IFrameAPI) {
          const element = containerRef.current;
          const spotifyUri = convertSpotifyUrlToUri(link);

          const options = {
            uri: spotifyUri,
            width: width,
            height: height
          };

          const callback = (EmbedController: any) => {
            setIsLoaded(true);
            // Store the controller locally on the element
            (element as any).spotifyController = EmbedController;
            // Register the controller globally
            window.spotifyControllers.set(embedId.current, EmbedController);
          };

          try {
            IFrameAPI.createController(element, options, callback);
          } catch (error) {
            console.error('Error creating Spotify embed controller:', error);
          }
        }
      }
    };

    // Load script if not already loaded
    if (!isScriptLoaded) {
      loadSpotifyScript();
    }

    // Initialize embed when script is loaded
    if (isScriptLoaded) {
      initializeSpotifyEmbed();
    }

    return () => {
      // Cleanup: remove script if it was added by this component
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }

      // Cleanup: remove controller references
      if (containerRef.current) {
        delete (containerRef.current as any).spotifyController;
      }
      // Remove from global registry
      window.spotifyControllers.delete(embedId.current);
    };
  }, [link, width, height, isScriptLoaded]);

  return (
    <div
      ref={containerRef}
      id={embedId.current}
      className="spotify-embed-container"
      style={{
        width,
        height,
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#1DB954' // Spotify brand color as fallback
      }}
    />
  );
}
