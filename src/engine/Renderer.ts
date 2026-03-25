import { Canvas, Text } from 'fabric';
import type { AppState } from '../store/useEditorStore';
import { TEMPLATES } from '../config/templates';

const textCache = new Map<string, Text>();

export function renderFrame(canvas: Canvas, state: AppState) {
  const { currentTime, transcript, templateId } = state;
  const tpl = TEMPLATES[templateId] || TEMPLATES['motivation'];

  // Clear existing objects
  canvas.clear();
  
  // Set Background
  canvas.backgroundColor = tpl.backgroundColor;

  // Find active word
  const activeWordIndex = transcript.findIndex(w => currentTime >= w.start && currentTime <= w.end);
  
  if (activeWordIndex !== -1) {
    const wordInfo = transcript[activeWordIndex];
    let textObj = textCache.get(wordInfo.word);
    
    if (!textObj) {
      // Create text object
      textObj = new Text(wordInfo.word.toUpperCase(), {
        fontFamily: tpl.fontFamily,
        fontSize: 160,
        fill: tpl.baseColor,
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center',
        left: 1080 / 2,
        top: 1920 / 2,
        textAlign: 'center',
        shadow: {
          color: 'rgba(0,0,0,0.5)',
          blur: 10,
          offsetX: 0,
          offsetY: 4
        } as any
      });
      textCache.set(wordInfo.word, textObj);
    }

    // Apply animation / scaling based on word lifetime
    const wordAge = currentTime - wordInfo.start;
    const wordDur = wordInfo.end - wordInfo.start;
    const progress = Math.min(1, Math.max(0, wordAge / wordDur));
    
    // Reset defaults
    textObj.set({ scaleX: 1, scaleY: 1, opacity: 1 });

    // Animation Logic
    if (tpl.animationType === 'punch') {
      const scale = 1 + Math.max(0, (1 - progress * 4) * 0.4); 
      textObj.set({ scaleX: scale, scaleY: scale });
    } else if (tpl.animationType === 'zoom') {
      const scale = 0.5 + progress * 0.6;
      textObj.set({ scaleX: scale, scaleY: scale, opacity: Math.min(1, progress * 5) });
    } else if (tpl.animationType === 'pop') {
      const scale = progress < 0.2 ? progress * 5 : 1 + Math.sin(progress * Math.PI) * 0.1;
      textObj.set({ scaleX: scale, scaleY: scale });
    } else if (tpl.animationType === 'fade') {
      textObj.set({ opacity: Math.sin(progress * Math.PI) });
    }

    // Position logic
    if (tpl.position === 'center') {
      textObj.set({ top: 1920 / 2 });
    } else if (tpl.position === 'bottom') {
      textObj.set({ top: 1920 * 0.8 });
    } else if (tpl.position === 'top') {
      textObj.set({ top: 1920 * 0.2 });
    }

    // Highlight Randomly or based on length
    if (wordInfo.word.length > 5 || activeWordIndex % 3 === 0) {
      textObj.set({ fill: tpl.highlightColor });
    } else {
      textObj.set({ fill: tpl.baseColor });
    }

    canvas.add(textObj);
  }
}
