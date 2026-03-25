import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { useEditorStore } from '../store/useEditorStore';
import { renderFrame } from '../engine/Renderer';

export default function CanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const reqRef = useRef<number>(0);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Fabric
    const canvas = new Canvas(canvasRef.current, {
      width: 1080,
      height: 1920,
      backgroundColor: '#000000',
      preserveObjectStacking: true,
      renderOnAddRemove: false
    });
    
    fabricRef.current = canvas;

    let destroyed = false;
    
    // Render Loop
    const loop = () => {
      if (destroyed || !fabricRef.current) return;
      
      const state = useEditorStore.getState();
      renderFrame(fabricRef.current, state);
      fabricRef.current.requestRenderAll();
      
      reqRef.current = requestAnimationFrame(loop);
    };
    
    reqRef.current = requestAnimationFrame(loop);

    return () => {
      destroyed = true;
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 overflow-hidden pointer-events-none z-10">
      <div className="text-zinc-500 font-mono text-xs mb-2 bg-zinc-950/80 px-2 py-1 rounded">1080x1920 Preview (Scaled)</div>
      <div className="relative bg-black rounded-lg shadow-2xl overflow-hidden pointer-events-auto ring-1 ring-white/10" 
           style={{ aspectRatio: '9/16', height: '100%', maxHeight: '600px' }}>
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
