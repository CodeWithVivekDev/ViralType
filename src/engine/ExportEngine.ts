import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Canvas } from 'fabric';
import { useEditorStore } from '../store/useEditorStore';
import type { AppState } from '../store/useEditorStore';
import { renderFrame } from './Renderer';

export async function exportVideo(isGreenscreen: boolean = false) {
  const store = useEditorStore.getState();
  if (!store.audioFile || store.duration <= 0) return;

  store.setIsLoading(true);
  store.setExportingPercentage(0);

  const ffmpeg = new FFmpeg();
  ffmpeg.on('progress', ({ progress }) => {
    store.setExportingPercentage(Math.round(50 + progress * 50));
  });

  await ffmpeg.load({
    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
  });

  ffmpeg.writeFile('audio.mp3', await fetchFile(store.audioFile));

  // Render loop locally for frames
  const fps = 30;
  const totalFrames = Math.floor(store.duration * fps);
  
  const el = document.createElement('canvas');
  el.width = 1080;
  el.height = 1920;
  const staticCanvas = new Canvas(el, { width: 1080, height: 1920 });

  for (let i = 0; i < totalFrames; i++) {
    const t = i / fps;
    const fakeState: AppState = {
      ...store,
      currentTime: t
    };

    renderFrame(staticCanvas, fakeState);
    if (isGreenscreen) {
      staticCanvas.backgroundColor = '#00FF00';
    }
    staticCanvas.renderAll();

    // DataURL to Blob to Uint8Array
    const dataUrl = staticCanvas.toDataURL({ format: 'png', multiplier: 1 });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    ffmpeg.writeFile(`frame%05d.png`.replace('%05d', i.toString().padStart(5, '0')), uint8);
    
    // UI Progress update (first 50% is frame rendering)
    if (i % 10 === 0) {
      store.setExportingPercentage(Math.round((i / totalFrames) * 50));
      await new Promise(r => setTimeout(r, 0)); // Yield to main thread
    }
  }

  // Muxing
  await ffmpeg.exec([
    '-framerate', '30',
    '-i', 'frame%05d.png',
    '-i', 'audio.mp3',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    'output.mp4'
  ]);

  const outputData = await ffmpeg.readFile('output.mp4');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outBlob = new Blob([new Uint8Array(outputData as any)], { type: 'video/mp4' });
  const outUrl = URL.createObjectURL(outBlob);

  const a = document.createElement('a');
  a.href = outUrl;
  a.download = `viraltype-${isGreenscreen ? 'greenscreen' : 'render'}.mp4`;
  a.click();

  store.setIsLoading(false);
  store.setExportingPercentage(0);
}
