import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { extractPeaks } from '../engine/AudioAnalyzer';

export default function Timeline() {
  const { audioFile, audioUrl, isPlaying, setIsPlaying, currentTime, setCurrentTime, setDuration, duration } = useEditorStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    if (audioFile) {
      extractPeaks(audioFile, 200).then(p => setPeaks(p));
    } else {
      setPeaks([]);
    }
  }, [audioFile]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current && isPlaying) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00.000";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const togglePlay = () => {
    if (!audioFile) return;
    setIsPlaying(!isPlaying);
  };

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  return (
    <div className="h-64 bg-zinc-950 border-t border-zinc-800 flex flex-col shrink-0 relative z-10">
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-4 bg-zinc-900/50">
        <button onClick={skipBack} className="p-1.5 hover:text-brand-pink transition rounded">
          <SkipBack className="w-4 h-4" />
        </button>
        <button onClick={togglePlay} className="p-1.5 border hover:text-brand-pink hover:border-brand-pink border-transparent transition rounded-full bg-zinc-800">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="text-xs font-mono text-zinc-400 ml-2">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <div className="flex-1 relative bg-zinc-950 overflow-x-auto overflow-y-hidden">
        {!audioFile ? (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
            Upload audio to see timeline tracks
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center px-4 py-8 pointer-events-none">
            {/* Waveform track */}
            <div className="w-full h-full flex items-center gap-[1px]">
              {peaks.map((peak, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-colors ${i / peaks.length <= currentTime / duration ? 'bg-brand-pink/80' : 'bg-zinc-700/50'}`}
                  style={{ height: `${Math.max(4, peak * 100)}%` }}
                />
              ))}
            </div>
            {/* Playhead */}
            {duration > 0 && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-brand-cyan z-20 shadow-[0_0_10px_rgba(0,245,212,0.5)]"
                style={{ left: `calc(1rem + (100% - 2rem) * ${currentTime / duration})` }}
              >
                <div className="w-3 h-3 bg-brand-cyan rounded-full -translate-x-1/2 -mt-1 shadow-[0_0_10px_rgba(0,245,212,0.8)]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
