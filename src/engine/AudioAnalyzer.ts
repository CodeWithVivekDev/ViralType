// src/engine/AudioAnalyzer.ts
export async function extractPeaks(audioFile: File, samples = 100): Promise<number[]> {
  const buffer = await audioFile.arrayBuffer();
  const ctx = new window.AudioContext();
  const audioBuffer = await ctx.decodeAudioData(buffer);
  
  const channelData = audioBuffer.getChannelData(0); // use first channel
  const step = Math.ceil(channelData.length / samples);
  const peaks = [];
  
  for (let i = 0; i < samples; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const idx = i * step + j;
      if (idx < channelData.length) {
        const datum = channelData[idx];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
    }
    // approximate intensity
    peaks.push(Math.max(Math.abs(min), Math.abs(max)));
  }
  
  return peaks;
}

export async function detectBeats(audioFile: File): Promise<number[]> {
  const buffer = await audioFile.arrayBuffer();
  const ctx = new window.AudioContext();
  const audioBuffer = await ctx.decodeAudioData(buffer);
  
  const channelData = audioBuffer.getChannelData(0);
  const beats: number[] = [];
  const sampleRate = audioBuffer.sampleRate;
  
  // Simple transient/peak detection for beats
  const threshold = 0.8; 
  const minBeatInterval = 0.3 * sampleRate; // ~300ms minimal interval
  
  let lastBeatAt = 0;
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold && i - lastBeatAt > minBeatInterval) {
      beats.push(i / sampleRate);
      lastBeatAt = i;
    }
  }
  
  return beats;
}
