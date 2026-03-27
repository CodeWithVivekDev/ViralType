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

  const { exportSettings } = store;
  const { resolution, fps, format } = exportSettings;
  const [width, height] = resolution.split('x').map(Number);

  ffmpeg.writeFile('audio.mp3', await fetchFile(store.audioFile));

  // Render loop locally for frames
  const totalFrames = Math.floor(store.duration * fps);
  
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  const staticCanvas = new Canvas(el, { width, height });

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

    // Async direct Blob extraction (significantly faster than toDataURL+fetch base64 loop)
    const blob = await new Promise<Blob>((resolve) => {
      el.toBlob((b) => resolve(b!), 'image/png');
    });
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
  const vcodec = format === 'webm' ? 'libvpx-vp9' : 'libx264';
  const acodec = format === 'webm' ? 'libvorbis' : 'aac';

  // Advanced FFmpeg performance arguments
  const extraArgs = format === 'webm' 
    ? ['-cpu-used', '8', '-deadline', 'realtime'] 
    : ['-preset', 'ultrafast', '-crf', '28'];

  await ffmpeg.exec([
    '-framerate', fps.toString(),
    '-i', 'frame%05d.png',
    '-i', 'audio.mp3',
    '-c:v', vcodec,
    ...extraArgs,
    '-c:a', acodec,
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-s', resolution,
    '-shortest',
    `output.${format}`
  ]);

  const outputData = await ffmpeg.readFile(`output.${format}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outBlob = new Blob([new Uint8Array(outputData as any)], { type: `video/${format}` });
  const outUrl = URL.createObjectURL(outBlob);

  const a = document.createElement('a');
  a.href = outUrl;
  a.download = `viraltype-${isGreenscreen ? 'greenscreen' : 'render'}.${format}`;
  a.click();

  store.setIsLoading(false);
  store.setExportingPercentage(0);
}
