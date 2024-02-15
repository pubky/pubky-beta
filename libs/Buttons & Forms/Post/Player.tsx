import { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import { Button } from '../Button';

type PlayerProps = {
  songs?: string[];
};

export const Player = ({ songs = [] }: PlayerProps) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setSongProgress(progress);
      }
    };

    const intervalId = setInterval(updateProgress, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const playPauseHandler = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSongHandler = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={songs[currentSongIndex]} />
      <div className="relative">
        <div className="w-[125.14px] h-16 justify-center items-center gap-4 inline-flex">
          <button onClick={prevSongHandler}>
            <Icon.Prev />
          </button>
          <Button.Action
            onClick={playPauseHandler}
            size="large"
            variant="custom"
            svg={isPlaying ? <Icon.Pause /> : <Icon.Play />}
          ></Button.Action>
          <button onClick={nextSongHandler}>
            <Icon.Next />
          </button>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1">
          <div
            className="h-full bg-gradient-to-r from-gray-400 to-white"
            style={{ width: `${songProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};