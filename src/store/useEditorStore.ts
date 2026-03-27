import { create } from 'zustand';

export interface WordMetadata {
  word: string;
  start: number; // in seconds
  end: number;
}

export interface ExportSettings {
  resolution: '1080x1920' | '720x1280';
  fps: 24 | 30;
  format: 'mp4' | 'webm';
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
  
  // New Viral features
  isViralMode: boolean;
  language: 'en' | 'hi' | 'hinglish';
  beats: number[];
  exportSettings: ExportSettings;
  
  // Actions
  setAudioFile: (file: File | null, url: string | null) => void;
  setTemplateId: (id: string) => void;
  setTranscript: (words: WordMetadata[]) => void;
  setIsLoading: (val: boolean) => void;
  setExportingPercentage: (val: number) => void;
  setIsPlaying: (val: boolean) => void;
  setCurrentTime: (val: number) => void;
  setDuration: (val: number) => void;
  setIsViralMode: (val: boolean) => void;
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
  setBeats: (beats: number[]) => void;
  setExportSettings: (settings: Partial<ExportSettings>) => void;
}

export const useEditorStore = create<AppState>((set) => ({
  audioFile: null,
  audioUrl: null,
  transcript: [],
  templateId: 'viral',
  isLoading: false,
  exportingPercentage: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  
  isViralMode: true,
  language: 'en',
  beats: [],
  exportSettings: { resolution: '1080x1920', fps: 30, format: 'mp4' },
  
  setAudioFile: (file, url) => set({ audioFile: file, audioUrl: url }),
  setTemplateId: (id) => set({ templateId: id }),
  setTranscript: (words) => set({ transcript: words }),
  setIsLoading: (val) => set({ isLoading: val }),
  setExportingPercentage: (val) => set({ exportingPercentage: val }),
  setIsPlaying: (val) => set({ isPlaying: val }),
  setCurrentTime: (val) => set({ currentTime: val }),
  setDuration: (val) => set({ duration: val }),
  setIsViralMode: (val) => set({ isViralMode: val }),
  setLanguage: (val) => set({ language: val }),
  setBeats: (val) => set({ beats: val }),
  setExportSettings: (settings) => set((state) => ({ exportSettings: { ...state.exportSettings, ...settings } }))
}));
