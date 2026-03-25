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
