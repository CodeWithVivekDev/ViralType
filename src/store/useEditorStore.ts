import { create } from 'zustand';

export interface WordMetadata {
  word: string;
  start: number; // in seconds
  end: number;
}

export interface AppState {
  audioFile: File | null;
  audioUrl: string | null;
  transcript: WordMetadata[];
  templateId: string;
  isLoading: boolean;
  exportingPercentage: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  
  // Actions
  setAudioFile: (file: File | null, url: string | null) => void;
  setTemplateId: (id: string) => void;
  setTranscript: (words: WordMetadata[]) => void;
  setIsLoading: (val: boolean) => void;
  setExportingPercentage: (val: number) => void;
  setIsPlaying: (val: boolean) => void;
  setCurrentTime: (val: number) => void;
  setDuration: (val: number) => void;
}

export const useEditorStore = create<AppState>((set) => ({
  audioFile: null,
  audioUrl: null,
  transcript: [],
  templateId: 'motivation',
  isLoading: false,
  exportingPercentage: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  
  setAudioFile: (file, url) => set({ audioFile: file, audioUrl: url }),
  setTemplateId: (id) => set({ templateId: id }),
  setTranscript: (words) => set({ transcript: words }),
  setIsLoading: (val) => set({ isLoading: val }),
  setExportingPercentage: (val) => set({ exportingPercentage: val }),
  setIsPlaying: (val) => set({ isPlaying: val }),
  setCurrentTime: (val) => set({ currentTime: val }),
  setDuration: (val) => set({ duration: val })
}));
