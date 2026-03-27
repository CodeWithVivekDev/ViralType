import type { WordMetadata } from '../store/useEditorStore';

const MOCK_TEXT_EN = "Welcome to Viral Type. This tool converts audio into viral kinetic typography videos. Watch these words jump pop and slide perfectly in sync. Start creating amazing content right now in your browser.";
const MOCK_TEXT_HI = "वायरल टाइप में आपका स्वागत है। यह टूल ऑडियो को वायरल काइनेटिक टाइपोग्राफी वीडियो में बदलता है। देखिए ये शब्द सिंक में कैसे जंप पॉप और स्लाइड करते हैं। अभी अपने ब्राउज़र में शानदार कंटेंट बनाना शुरू करें।";
const MOCK_TEXT_HINGLISH = "Viral Type mein aapka swagat hai. Yeh tool aapke audio ko viral kinetic video mein convert karta hai. Dekho kaise words perfectly sync mein pop aur slide hote hain. Aaj hi apna awesome content banana shuru karo.";

export async function generateMockTranscript(duration: number, language: 'en' | 'hi' | 'hinglish' = 'en'): Promise<WordMetadata[]> {
  const textMap = {
    'en': MOCK_TEXT_EN,
    'hi': MOCK_TEXT_HI,
    'hinglish': MOCK_TEXT_HINGLISH
  };
  
  const words = textMap[language].split(' ');
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
