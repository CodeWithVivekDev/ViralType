import React from 'react';
import { Download, Upload, Zap } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { generateMockTranscript } from '../engine/TranscriptionEngine';
import { exportVideo } from '../engine/ExportEngine';

export default function TopBar() {
  const { setAudioFile, audioFile, setTranscript, setDuration, isLoading } = useEditorStore();

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAudioFile(file, url);
      
      const audio = new Audio(url);
      audio.onloadedmetadata = async () => {
        setDuration(audio.duration);
        const words = await generateMockTranscript(audio.duration);
        setTranscript(words);
      };
    }
  };

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-2">
        <Zap className="w-6 h-6 text-brand-pink fill-brand-pink" />
        <h1 className="text-xl font-heading font-bold tracking-tight">ViralType</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div>
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {audioFile ? audioFile.name : 'Import Audio'}
            <input type="file" accept="audio/mp3, audio/wav" className="hidden" onChange={handleAudioUpload} />
          </label>
        </div>
        
        <button 
          onClick={() => exportVideo(true)}
          disabled={!audioFile || isLoading}
          className="bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          Greenscreen
        </button>

        <button 
          onClick={() => exportVideo(false)}
          disabled={!audioFile || isLoading}
          className="bg-brand-purple hover:bg-opacity-90 transition px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-brand-purple/20 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isLoading ? 'Exporting...' : 'Export Video'}
        </button>
      </div>
    </header>
  );
}
