import type { WordMetadata } from '../store/useEditorStore';

const MOCK_TEXT = "Welcome to Viral Type. This tool converts audio into viral kinetic typography videos. Watch these words jump pop and slide perfectly in sync. Start creating amazing content right now in your browser.";

export async function generateMockTranscript(duration: number): Promise<WordMetadata[]> {
  const words = MOCK_TEXT.split(' ');
  const totalWords = words.length;
  // Estimate time per word
  const tpf = duration / totalWords;
  
  const transcript: WordMetadata[] = [];
  let currentStart = 0;
  
  for (let i = 0; i < words.length; i++) {
    const wordDur = tpf;
    transcript.push({
      word: words[i],
      start: currentStart,
      end: currentStart + wordDur - 0.05 // Tiny gap
    });
    currentStart += wordDur;
  }
  
  return transcript;
}
