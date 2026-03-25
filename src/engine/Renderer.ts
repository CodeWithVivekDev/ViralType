import { Canvas, Text } from 'fabric';
import type { AppState } from '../store/useEditorStore';
import { TEMPLATES } from '../config/templates';

const textCache = new Map<string, Text>();

const EMOJI_MAP: Record<string, string> = {
  money: '💰', cash: '💰', rich: '🤑', dollars: '💵',
  success: '🚀', rocket: '🚀', growth: '📈',
  ai: '🤖', robot: '🤖', future: '🔮',
  win: '🏆', winner: '🏆', champion: '🥇',
  fire: '🔥', hot: '🔥', lit: '🔥',
  love: '❤️', heart: '❤️', passion: '❤️',
  mind: '🧠', brain: '🧠', smart: '🧠',
  idea: '💡', bright: '💡', light: '💡',
  time: '⏳', clock: '⏰', late: '⏳', fast: '⚡',
  warning: '⚠️', alert: '🚨',
  strong: '💪', gym: '💪', powerful: '💪',
  happy: '😊', sad: '😢', angry: '😡'
};

export function renderFrame(canvas: Canvas, state: AppState) {
  const { currentTime, transcript, templateId, isViralMode, beats } = state;
  const tpl = TEMPLATES[templateId] || TEMPLATES['viral'];

  // Clear existing objects
  canvas.clear();
  
  // Set Background
  canvas.backgroundColor = tpl.backgroundColor;
  
  const w = canvas.width || 1080;
  const h = canvas.height || 1920;
  const fontScale = w / 1080;

  // Beat Sync: check if we are within 100ms of a beat pulse
  let beatScale = 1;
  if (isViralMode && beats.length > 0) {
    const isBeat = beats.some(b => Math.abs(currentTime - b) < 0.1);
    if (isBeat) beatScale = 1.05; // 5% pulse on beat
  }

  // Find active word
  const activeWordIndex = transcript.findIndex(word => currentTime >= word.start && currentTime <= word.end);
  
  if (activeWordIndex !== -1) {
    const wordInfo = transcript[activeWordIndex];
    const cacheKey = `${wordInfo.word}_${templateId}_${isViralMode}_${w}x${h}`;
    let textObj = textCache.get(cacheKey);
    
    if (!textObj) {
      let displayText = wordInfo.word.toUpperCase();
      if (isViralMode) {
        const cleanWord = wordInfo.word.toLowerCase().replace(/[^a-z]/g, '');
        if (EMOJI_MAP[cleanWord]) {
          displayText += ` ${EMOJI_MAP[cleanWord]}`;
        }
      }

      // Create text object
      textObj = new Text(displayText, {
        fontFamily: tpl.fontFamily,
        fontSize: 160 * fontScale,
        fill: tpl.baseColor,
        stroke: tpl.strokeColor || undefined,
        strokeWidth: (tpl.strokeWidth || 0) * fontScale,
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center',
        left: w / 2,
        top: h / 2,
        textAlign: 'center',
        shadow: {
          color: 'rgba(0,0,0,0.5)',
          blur: 10,
          offsetX: 0,
          offsetY: 4
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      });
      textCache.set(cacheKey, textObj);
    }

    // Apply animation / scaling based on word lifetime
    const wordAge = currentTime - wordInfo.start;
    const wordDur = wordInfo.end - wordInfo.start;
    const progress = Math.min(1, Math.max(0, wordAge / wordDur));
    
    // Reset defaults
    textObj.set({ scaleX: beatScale, scaleY: beatScale, opacity: 1 });

    // Animation Logic
    if (tpl.animationType === 'punch') {
      const scale = (1 + Math.max(0, (1 - progress * 4) * 0.4)) * beatScale; 
      textObj.set({ scaleX: scale, scaleY: scale });
    } else if (tpl.animationType === 'zoom') {
      const scale = (0.5 + progress * 0.6) * beatScale;
      textObj.set({ scaleX: scale, scaleY: scale, opacity: Math.min(1, progress * 5) });
    } else if (tpl.animationType === 'pop') {
      const scale = (progress < 0.2 ? progress * 5 : 1 + Math.sin(progress * Math.PI) * 0.1) * beatScale;
      textObj.set({ scaleX: scale, scaleY: scale });
    } else if (tpl.animationType === 'fade') {
      textObj.set({ opacity: Math.sin(progress * Math.PI) });
    }

    // Position logic
    if (tpl.position === 'center') {
      textObj.set({ top: h / 2 });
    } else if (tpl.position === 'bottom') {
      textObj.set({ top: h * 0.8 });
    } else if (tpl.position === 'top') {
      textObj.set({ top: h * 0.2 });
    }

    // Highlight logic
    if (wordInfo.word.length > 5 || activeWordIndex % 3 === 0) {
      textObj.set({ fill: tpl.highlightColor });
    } else {
      textObj.set({ fill: tpl.baseColor });
    }

    canvas.add(textObj);
  }
}
